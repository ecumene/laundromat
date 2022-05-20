import type { editor } from "monaco-editor/esm/vs/editor/editor.api";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
// import MonokaiTheme from "./theme";

type MonacoEditorProps = {
  initialContents?: string;
  setContents: React.Dispatch<React.SetStateAction<string>>;
  language: string;
  disabled?: boolean;
};

const MonacoEditor: FunctionComponent<MonacoEditorProps> = ({
  setContents,
  language,
  initialContents = "",
  disabled = false,
}) => {
  const [monacoEditor, setMonacoEditor] =
    useState<editor.IStandaloneCodeEditor | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let createdEditor: editor.IStandaloneCodeEditor | undefined;
    (async () => {
      if (editorRef.current === null) {
        return;
      }
      // monaco.editor.defineTheme("monokaipro", MonokaiTheme);
      createdEditor = monaco.editor.create(editorRef.current, {
        automaticLayout: true,
        value: initialContents,
        readOnly: disabled,
        minimap: {
          enabled: false,
        },
        language,
      });
      createdEditor.onDidChangeModelContent((event) => {
        setContents(createdEditor!.getValue());
      });
      setMonacoEditor(createdEditor);
    })();
    return () => {
      if (createdEditor !== undefined) {
        createdEditor.dispose();
      }
    };
  }, [disabled, editorRef]);

  return (
    <div
      ref={editorRef}
      style={{
        height: "100px",
        pointerEvents: disabled ? "none" : "auto",
        opacity: disabled ? 0.3 : 1,
      }}
    />
  );
};

export default MonacoEditor;
