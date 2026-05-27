/**
 * Extração GPMF no browser — corrige leitura em chunks do gpmf-extract
 * (ArrayBuffer parcial corrompia o parse do moov em vídeos GoPro).
 */
function appendBufferSlice(mp4boxFile, chunk, offset) {
  let buffer;
  if (
    chunk.byteOffset === 0 &&
    chunk.byteLength === chunk.buffer.byteLength
  ) {
    buffer = chunk.buffer;
  } else {
    buffer = chunk.buffer.slice(
      chunk.byteOffset,
      chunk.byteOffset + chunk.byteLength,
    );
  }
  buffer.fileStart = offset;
  mp4boxFile.appendBuffer(buffer);
}

function findGpmdTrack(tracks) {
  if (!tracks?.length) return null;

  for (const track of tracks) {
    const codec = String(track.codec ?? "").toLowerCase();
    if (codec === "gpmd") return track;
  }

  for (const track of tracks) {
    const type = String(track.type ?? "").toLowerCase();
    const codec = String(track.codec ?? "").toLowerCase();
    if (
      (type === "metadata" || type === "meta" || codec.includes("gpmd")) &&
      track.nb_samples > 0
    ) {
      return track;
    }
  }

  for (const track of tracks) {
    const name = String(track.name ?? "").toLowerCase();
    if (
      (name.includes("gopro") && name.includes("met")) ||
      name.includes("gpmd")
    ) {
      return track;
    }
  }

  return null;
}

function readFileInChunks(file, mp4boxFile, progress) {
  const chunkSize = 4 * 1024 * 1024;
  let offset = 0;
  const fileSize = file.size;

  return file.stream().pipeTo(
    new WritableStream({
      write(chunk) {
        appendBufferSlice(mp4boxFile, chunk, offset);
        offset += chunk.byteLength;
        if (progress && fileSize > 0) {
          progress(Math.min(99, Math.round((offset / fileSize) * 100)));
        }
      },
    }),
  );
}

/**
 * @param {File|Blob} file
 * @param {{ progress?: (n: number) => void, browserMode?: boolean }} [options]
 */
async function gpmfExtractBrowser(file, { progress } = {}) {
  const MP4Box = require("mp4box");

  const LARGE_FILE_BYTES = 512 * 1024 * 1024;
  const useChunked = file.size > LARGE_FILE_BYTES;

  return new Promise((resolve, reject) => {
    const mp4boxFile = MP4Box.createFile();
    const timing = {};
    let settled = false;

    const fail = (err) => {
      if (settled) return;
      settled = true;
      reject(err instanceof Error ? err : new Error(String(err)));
    };

    const succeed = (payload) => {
      if (settled) return;
      settled = true;
      resolve(payload);
    };

    mp4boxFile.onError = (e) => fail(e);

    mp4boxFile.onReady = (videoData) => {
      const track = findGpmdTrack(videoData.tracks);
      if (!track) {
        const summary = (videoData.tracks || [])
          .map(
            (t) =>
              `${t.id}:${t.type ?? "?"}:${t.codec ?? "?"}:${t.name ?? ""}`,
          )
          .join(" | ");
        fail(
          new Error(
            `Track not found (gpmd). Trilhas no arquivo: ${summary || "nenhuma"}`,
          ),
        );
        return;
      }

      if (track.created) {
        timing.start = new Date(track.created);
        timing.start.setMinutes(
          timing.start.getMinutes() + timing.start.getTimezoneOffset(),
        );
      }

      for (const t of videoData.tracks) {
        if (t.type === "video" && t.track_height > 0) {
          timing.videoDuration = t.movie_duration / t.movie_timescale;
          timing.frameDuration = timing.videoDuration / t.nb_samples;
          break;
        }
      }

      mp4boxFile.setExtractionOptions(track.id, null, {
        nbSamples: track.nb_samples,
      });

      mp4boxFile.onSamples = (_id, _user, samples) => {
        const totalSize = samples.reduce((acc, s) => acc + s.size, 0);
        const rawData = new Uint8Array(totalSize);
        timing.samples = [];
        let offset = 0;

        for (const sample of samples) {
          timing.samples.push({
            cts: sample.cts,
            duration: sample.duration,
          });
          rawData.set(sample.data, offset);
          offset += sample.size;
        }

        if (progress) progress(100);
        succeed({ rawData, timing });
      };

      mp4boxFile.start();
    };

    const run = async () => {
      try {
        if (useChunked) {
          await readFileInChunks(file, mp4boxFile, progress);
          mp4boxFile.flush();
        } else {
          if (progress) progress(5);
          const arrayBuffer = await file.arrayBuffer();
          arrayBuffer.fileStart = 0;
          mp4boxFile.appendBuffer(arrayBuffer);
          mp4boxFile.flush();
          if (progress) progress(99);
        }
      } catch (err) {
        fail(err);
      }
    };

    run();
  });
}

module.exports = { gpmfExtractBrowser, findGpmdTrack };
