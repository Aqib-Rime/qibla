import { Button } from "@qibla/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@qibla/ui/components/dialog";
import { Label } from "@qibla/ui/components/label";
import { ScrollArea } from "@qibla/ui/components/scroll-area";
import {
  IconLoader2,
  IconPhoto,
  IconPhotoPlus,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  ALLOWED_PHOTO_MIME,
  isAllowedPhotoMime,
  uploadMosquePhoto,
} from "@/features/mosques/lib/upload-photo";

const MAX_PHOTOS = 10;

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
};

export function MosquePhotosField({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const thumbnail = value[0];
  const count = value.length;

  return (
    <div className="space-y-2">
      <div>
        <Label>Photos</Label>
        <p className="text-xs text-muted-foreground">
          The first photo is shown as the thumbnail on the mobile app.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-md border p-3">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted text-muted-foreground">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <IconPhoto className="size-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">
            {count === 0
              ? "No photos"
              : count === 1
                ? "1 photo"
                : `${count} photos`}
          </p>
          <p className="text-xs text-muted-foreground">
            Up to {MAX_PHOTOS}. Add, reorder, or set thumbnail.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => setOpen(true)}
        >
          Manage photos
        </Button>
      </div>

      <ManagePhotosDialog
        open={open}
        onOpenChange={setOpen}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}

function ManagePhotosDialog({
  open,
  onOpenChange,
  value,
  onChange,
  disabled,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingIds, setUploadingIds] = useState<string[]>([]);

  const remaining = MAX_PHOTOS - value.length - uploadingIds.length;
  const isBusy = uploadingIds.length > 0;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const picked = Array.from(files);

    const invalid = picked.find((f) => !isAllowedPhotoMime(f.type));
    if (invalid) {
      toast.error("Only JPG, PNG, or WebP images");
      return;
    }

    const usable = picked.slice(0, Math.max(remaining, 0));
    if (usable.length < picked.length) {
      toast.error(`Max ${MAX_PHOTOS} photos`);
    }
    if (usable.length === 0) return;

    const ids: string[] = usable.map(() => crypto.randomUUID());
    setUploadingIds((prev) => [...prev, ...ids]);
    const uploaded: string[] = [];
    try {
      for (const file of usable) {
        try {
          const url = await uploadMosquePhoto(file);
          uploaded.push(url);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Upload failed");
        }
      }
      if (uploaded.length > 0) {
        onChange([...value, ...uploaded]);
      }
    } finally {
      setUploadingIds((prev) => prev.filter((id) => !ids.includes(id)));
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function setThumbnail(index: number) {
    if (index === 0) return;
    const next = [...value];
    const [picked] = next.splice(index, 1);
    if (picked) next.unshift(picked);
    onChange(next);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b px-6 pb-4 pt-6">
          <DialogTitle>Manage photos</DialogTitle>
          <DialogDescription>
            The first photo is the thumbnail shown in the mobile app. Use the
            star to promote any photo to the thumbnail.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3 border-b px-6 py-3">
          <p className="text-xs text-muted-foreground">
            {value.length} of {MAX_PHOTOS} used
          </p>
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={disabled || remaining <= 0}
            onClick={() => inputRef.current?.click()}
          >
            <IconPhotoPlus className="size-4" />
            Add photos
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_PHOTO_MIME.join(",")}
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="px-6 py-4">
            {value.length === 0 && uploadingIds.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground">
                <IconPhoto className="size-6" />
                <p>No photos yet</p>
                <p className="text-xs">
                  Click “Add photos” to upload JPG, PNG, or WebP.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {value.map((url, index) => (
                  <div
                    key={url}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted"
                  >
                    <img
                      src={url}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {index === 0 && (
                      <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-primary-foreground shadow-sm">
                        <IconStarFilled className="size-3" />
                        Thumbnail
                      </div>
                    )}
                    <div className="absolute inset-x-2 bottom-2 flex items-center justify-end gap-1.5">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => setThumbnail(index)}
                          title="Set as thumbnail"
                          disabled={disabled}
                          className="flex items-center gap-1 rounded-md bg-background/95 px-2 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur hover:bg-background"
                        >
                          <IconStar className="size-3.5" />
                          Set thumbnail
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        title="Remove"
                        disabled={disabled}
                        className="flex items-center rounded-md bg-background/95 p-1.5 text-destructive shadow-sm backdrop-blur hover:bg-background"
                      >
                        <IconTrash className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {uploadingIds.map((id) => (
                  <div
                    key={id}
                    className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/50 text-muted-foreground"
                  >
                    <IconLoader2 className="size-6 animate-spin" />
                    <p className="text-xs">Uploading…</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 border-t px-6 py-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isBusy}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
