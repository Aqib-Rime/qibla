import { IconButton } from "@/components/ui/icon-button";
import { useToggleSaved } from "../hooks/use-mosques";

type Props = {
  mosqueId: string;
  isSaved: boolean;
};

export function MosqueSaveButton({ mosqueId, isSaved }: Props) {
  const toggle = useToggleSaved();

  return (
    <IconButton
      icon="heart"
      variant={isSaved ? "filled" : "default"}
      onPress={() => toggle.mutate({ mosqueId, save: !isSaved })}
      disabled={toggle.isPending}
      accessibilityLabel={isSaved ? "Unsave mosque" : "Save mosque"}
    />
  );
}
