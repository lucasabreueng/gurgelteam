(function ($) {
	'use strict';

	/**
	 * Dados de exemplo: vagas por dia da semana (independente da data exata) e categoria.
	 * Em produção, use a data ISO na chamada à API.
	 */
	var SLOT_DATA = {
		segunda: {
			cadete: [
				{ t: '09:00', v: 4 },
				{ t: '11:00', v: 2 },
				{ t: '15:30', v: 3 }
			],
			f400: [
				{ t: '10:00', v: 2 },
				{ t: '14:00', v: 1 }
			],
			'125cc': [
				{ t: '16:00', v: 3 },
				{ t: '18:00', v: 2 }
			]
		},
		terca: {
			cadete: [{ t: '09:30', v: 5 }, { t: '13:00', v: 2 }],
			f400: [{ t: '10:30', v: 3 }, { t: '17:00', v: 2 }],
			'125cc': [{ t: '15:00', v: 4 }]
		},
		quarta: {
			cadete: [{ t: '08:00', v: 3 }, { t: '10:00', v: 3 }, { t: '16:00', v: 1 }],
			f400: [],
			'125cc': [{ t: '11:00', v: 2 }, { t: '19:00', v: 3 }]
		},
		quinta: {
			cadete: [{ t: '14:00', v: 2 }],
			f400: [{ t: '09:00', v: 1 }, { t: '15:30', v: 2 }],
			'125cc': [{ t: '10:00', v: 5 }, { t: '18:30', v: 2 }]
		},
		sexta: {
			cadete: [{ t: '09:00', v: 6 }, { t: '11:30', v: 4 }, { t: '20:00', v: 2 }],
			f400: [{ t: '10:00', v: 3 }, { t: '16:00', v: 2 }],
			'125cc': [{ t: '14:00', v: 3 }]
		},
		sabado: {
			cadete: [{ t: '08:30', v: 8 }, { t: '10:30', v: 5 }, { t: '14:00', v: 4 }],
			f400: [{ t: '09:30', v: 4 }, { t: '13:00', v: 3 }, { t: '17:00', v: 2 }],
			'125cc': [{ t: '11:00', v: 3 }, { t: '15:00', v: 2 }, { t: '18:00', v: 1 }]
		},
		domingo: {
			cadete: [{ t: '10:00', v: 3 }],
			f400: [{ t: '11:00', v: 2 }],
			'125cc': []
		}
	};

	var WEEKDAY_KEYS = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];

	var LIST_MAP = {
		cadete: '#kartSlotsCadete',
		f400: '#kartSlotsF400',
		'125cc': '#kartSlots125cc'
	};

	function dateToIsoLocal(d) {
		var y = d.getFullYear();
		var m = String(d.getMonth() + 1).padStart(2, '0');
		var day = String(d.getDate()).padStart(2, '0');
		return y + '-' + m + '-' + day;
	}

	function dateToWeekdayKey(d) {
		return WEEKDAY_KEYS[d.getDay()];
	}

	function formatDateLongPt(d) {
		var s = d.toLocaleDateString('pt-BR', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
		return s.charAt(0).toUpperCase() + s.slice(1);
	}

	function renderSlots(weekdayKey, isoDate) {
		var data = SLOT_DATA[weekdayKey] || {};
		['cadete', 'f400', '125cc'].forEach(function (cat) {
			var $list = $(LIST_MAP[cat]);
			$list.empty();
			var arr = data[cat] || [];
			if (!arr.length) {
				$list.append(
					'<li class="kart-no-slots">Nenhuma vaga nesta categoria para este dia.</li>'
				);
				return;
			}
			arr.forEach(function (slot) {
				var $btn = $(
					'<button type="button" class="kart-slot-btn" data-date="' +
						isoDate +
						'" data-weekday="' +
						weekdayKey +
						'" data-cat="' +
						cat +
						'" data-time="' +
						slot.t +
						'">' +
						'<span class="kart-slot-time">' +
						slot.t +
						'</span>' +
						'<span class="kart-slot-meta">' +
						slot.v +
						' vaga' +
						(slot.v !== 1 ? 's' : '') +
						'</span></button>'
				);
				$list.append($('<li></li>').append($btn));
			});
		});
	}

	function applyDate(dateObj) {
		var key = dateToWeekdayKey(dateObj);
		var iso = dateToIsoLocal(dateObj);
		$('#kartSelectedDateLabel').text(formatDateLongPt(dateObj));
		renderSlots(key, iso);
	}

	$(function () {
		var $mount = $('#kartCalendar');
		if (!$mount.length || typeof flatpickr === 'undefined') {
			return;
		}

		var locale =
			typeof flatpickr !== 'undefined' && flatpickr.l10ns && flatpickr.l10ns.pt
				? flatpickr.l10ns.pt
				: undefined;

		flatpickr($mount[0], {
			inline: true,
			locale: locale,
			dateFormat: 'Y-m-d',
			minDate: 'today',
			defaultDate: new Date(),
			disableMobile: true,
			onChange: function (selectedDates) {
				if (selectedDates.length) {
					applyDate(selectedDates[0]);
				}
			},
			onReady: function (selectedDates, dateStr, instance) {
				var d = instance.selectedDates[0] || new Date();
				applyDate(d);
			}
		});

		$(document).on('click', '.kart-slot-btn', function () {
			var iso = $(this).data('date');
			var cat = $(this).data('cat');
			var time = $(this).data('time');
			var catLabel = cat === 'cadete' ? 'Cadete' : cat === 'f400' ? 'F400' : '125cc';
			var msg =
				'Horário selecionado (demonstração):\n' +
				iso +
				' — ' +
				catLabel +
				' às ' +
				time +
				'.\nEm produção, aqui seguiria para confirmação ou pagamento.';
			window.alert(msg);
		});
	});
})(jQuery);
