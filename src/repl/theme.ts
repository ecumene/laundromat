import type { editor } from "monaco-editor/esm/vs/editor/editor.api";

// Created based off of https://tmtheme-editor.herokuapp.com/#!/editor/theme/Monokai and converted
// using https://bitwiser.in/monaco-themes/
const MonokaiProTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    {
      foreground: "69676c",
      fontStyle: " italic",
      token: "comment",
    },
    {
      foreground: "fce566",
      token: "string",
    },
    {
      foreground: "948ae3",
      token: "constant.numeric",
    },
    {
      foreground: "948ae3",
      token: "constant.language",
    },
    {
      foreground: "948ae3",
      token: "constant.character",
    },
    {
      foreground: "948ae3",
      token: "constant.other",
    },
    {
      foreground: "f7f1ff",
      token: "variable",
    },
    {
      foreground: "fc618d",
      token: "keyword",
    },
    {
      foreground: "fc618d",
      token: "storage",
    },
    {
      foreground: "5ad4e6",
      fontStyle: "italic",
      token: "storage.type",
    },
    {
      foreground: "5ad4e6",
      token: "entity.name.class",
    },
    {
      foreground: "5ad4e6",
      fontStyle: "italic ",
      token: "entity.other.inherited-class",
    },
    {
      foreground: "7bd88f",
      token: "entity.name.function",
    },
    {
      foreground: "fd9353",
      fontStyle: "italic",
      token: "variable.parameter",
    },
    {
      foreground: "fc618d",
      token: "entity.name.tag",
    },
    {
      foreground: "5ad4e6",
      fontStyle: " italic",
      token: "entity.other.attribute-name",
    },
    {
      foreground: "5ad4e6",
      token: "support.function",
    },
    {
      foreground: "5ad4e6",
      token: "support.constant",
    },
    {
      foreground: "5ad4e6",
      fontStyle: "italic",
      token: "support.type",
    },
    {
      foreground: "5ad4e6",
      fontStyle: "italic",
      token: "support.class",
    },
    {
      foreground: "5ad4e6",
      fontStyle: " italic",
      token: "type.hcl",
    },
  ],
  colors: {
    "editor.foreground": "#F7F1FF",
    "editor.background": "#222222",
    "editor.selectionBackground": "#BAB6C026",
    "editor.lineHighlightBackground": "#F7F1FF0D",
    "editorCursor.foreground": "#F7F1FF",
    "editorWhitespace.foreground": "#F7F1FF",
  },
};

export default MonokaiProTheme;
