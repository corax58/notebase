import type { CreateNote, Note } from "@/types";
import AuthLayout from "./AuthLayout";
import NoteForm from "./note-form";
import RecentNotesView from "@/components/RecentNotesView";
import { sourceFromTab } from "@/lib/source";

type PopupView =
  | { name: "login" }
  | { name: "recent" }
  | { name: "form"; note: CreateNote }
  | { name: "edit"; note: Note }
  | { name: "detail"; note: Note };

async function blankNote(): Promise<CreateNote> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return { content: "", ...sourceFromTab(tab) };
}

function editableNote(note: Note): CreateNote {
  return {
    content: note.content,
    folderId: note.folderId ?? undefined,
    sourceUrl: note.sourceUrl ?? undefined,
    sourceTitle: note.sourceTitle ?? undefined,
    faviconUrl: note.faviconUrl ?? undefined,
    label: note.label ?? undefined,
    tags: note.tags,
  };
}

const backendUrl = import.meta.env.WXT_API_URL;

function App() {
  const [view, setView] = useState<PopupView>({ name: "recent" });

  useEffect(() => {
    browser.storage.local
      .get<{ draftNote?: CreateNote }>("draftNote")
      .then(({ draftNote }) => {
        if (draftNote) {
          browser.storage.local.remove("draftNote");
          setView({ name: "form", note: draftNote });
        }
      });
  }, []);

  return (
    <div className="w-90 h-125 flex flex-col overflow-hidden">
      <AuthLayout>
        <div className="flex-1 overflow-y-auto">
          {view.name === "recent" && (
            <RecentNotesView
              onAddNote={async () =>
                setView({ name: "form", note: await blankNote() })
              }
              onOpenNotebase={() => {
                browser.tabs.create({ url: `${backendUrl}/dashboard/notes` });
              }}
              onSelectNote={(note) => setView({ name: "detail", note })}
            />
          )}

          {view.name === "form" && (
            <NoteForm
              initialNote={view.note}
              onDone={() => setView({ name: "recent" })}
            />
          )}
          {view.name === "edit" && (
            <NoteForm
              initialNote={editableNote(view.note)}
              noteId={view.note.id}
              onDone={(saved) =>
                setView({ name: "detail", note: saved ?? view.note })
              }
            />
          )}
          {view.name === "detail" && (
            <NoteDetailView
              note={view.note}
              onBack={() => setView({ name: "recent" })}
              onEdit={() => setView({ name: "edit", note: view.note })}
              onDeleted={() => setView({ name: "recent" })}
            />
          )}
        </div>
      </AuthLayout>
    </div>
  );
}

export default App;
