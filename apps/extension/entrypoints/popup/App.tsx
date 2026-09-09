import type { CreateNote, Note } from "@/types";
import AuthLayout from "./AuthLayout";
import NoteForm from "./note-form";
import RecentNotesView from "@/components/RecentNotesView";

type PopupView =
  | { name: "login" }
  | { name: "recent" }
  | { name: "form"; note: CreateNote }
  | { name: "detail"; note: Note };

async function blankNote(): Promise<CreateNote> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return {
    content: "",
    sourceUrl: tab?.url ?? "",
    sourceTitle: tab?.title ?? "",
    faviconUrl: tab?.favIconUrl ?? "",
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
          {view.name === "detail" && (
            <NoteDetailView
              note={view.note}
              onBack={() => setView({ name: "recent" })}
              onDeleted={() => setView({ name: "recent" })}
            />
          )}
        </div>
      </AuthLayout>
    </div>
  );
}

export default App;
