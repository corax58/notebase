"use client";
import {
  MDXEditor,
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertThematicBreak,
  Separator,
  MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

export default function DocEditor({
  value,
  handleChange,
  editorRef,
}: {
  value: string;
  handleChange: (markdown: string, initialMarkdownNormalize: boolean) => void;
  editorRef: React.RefObject<MDXEditorMethods | null>;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <MDXEditor
        ref={editorRef}
        markdown={value}
        onChange={handleChange}
        contentEditableClassName="prose dark:prose-invert max-w-none"

        plugins={[
          headingsPlugin(),
          quotePlugin(),
          listsPlugin(),
          thematicBreakPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <ListsToggle />
                <CreateLink />
                <InsertThematicBreak />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
}
