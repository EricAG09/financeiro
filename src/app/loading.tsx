import { LoadingState } from "@/frontend/components/ui/loading-state";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-lg px-4 py-6 md:max-w-5xl md:px-6">
      <LoadingState rows={4} label="Carregando a página" />
    </div>
  );
}
