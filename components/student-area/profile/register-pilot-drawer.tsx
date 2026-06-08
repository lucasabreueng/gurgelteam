"use client";

import { useRef, useState } from "react";
import { TeamDrawerShell } from "@/components/admin/team/team-drawer-shell";
import { DrawerFooterActions } from "@/components/ui/drawer-footer";
import { RegisterPilotForm } from "./register-pilot-form";

type Props = {
  open: boolean;
  guardianProfileId: string;
  demoParam?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export function RegisterPilotDrawer({
  open,
  guardianProfileId,
  demoParam = null,
  onClose,
  onSuccess,
}: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitState, setSubmitState] = useState({
    loading: false,
    usernameLoading: false,
  });

  const handleSuccess = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <TeamDrawerShell
      open={open}
      onClose={onClose}
      title="Cadastrar piloto"
      titleId="register-pilot-drawer-title"
      footer={
        <DrawerFooterActions columns={2}>
          <button
            type="button"
            onClick={onClose}
            className="btn-outline-md bg-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => formRef.current?.requestSubmit()}
            disabled={submitState.loading || submitState.usernameLoading}
            className="btn-primary-md disabled:opacity-50"
          >
            {submitState.loading ? "Cadastrando…" : "Cadastrar piloto"}
          </button>
        </DrawerFooterActions>
      }
    >
      <RegisterPilotForm
        key={open ? "open" : "closed"}
        embedded
        hideActions
        formRef={formRef}
        resetWhen={open}
        guardianProfileId={guardianProfileId}
        demoParam={demoParam}
        onSubmitStateChange={setSubmitState}
        onCancel={onClose}
        onSuccess={handleSuccess}
      />
    </TeamDrawerShell>
  );
}
