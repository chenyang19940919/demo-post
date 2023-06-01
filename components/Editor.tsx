import { useState, useEffect } from "react";
import "@wangeditor/editor/dist/css/style.css";
import { Editor as Wangeditor, Toolbar } from "@wangeditor/editor-for-react";
import {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
  i18nAddResources,
  i18nChangeLanguage,
} from "@wangeditor/editor";

i18nAddResources("zh-TW", {
  blockQuote: { title: "引用" },
  codeBlock: { title: "代碼塊" },
  color: {
    color: "文字顏色",
    bgColor: "背景顏色",
    default: "默認顏色",
    clear: "清除背景色",
  },
  common: {
    ok: "確定",
    delete: "刪除",
    enter: "進入",
  },
  divider: {
    title: "分割線",
  },
  editor: {
    more: "更多",
    justify: "對齊",
    indent: "縮排",
    image: "圖片",
    video: "影像",
  },
  emotion: {
    title: "表情",
  },
  fontSize: {
    title: "字型大小",
    default: "默認字型大小",
  },
  fontFamily: {
    title: "字型",
    default: "默認字型",
  },
  fullScreen: {
    title: "全螢幕",
  },
  header: {
    title: "標題",
    text: "正文",
  },
  image: {
    netImage: "網路圖片",
    delete: "删除圖片",
    edit: "編輯圖片",
    viewLink: "查看連結",
    src: "圖片地址",
    desc: "圖片描述",
    link: "圖片連結",
  },
  indent: {
    decrease: "减少縮排",
    increase: "增加縮排",
  },
  justify: {
    left: "靠左對齊",
    right: "靠右對齊",
    center: "置中對齊",
    justify: "兩端對齊",
  },
  lineHeight: {
    title: "行高",
    default: "默認行高",
  },
  link: {
    insert: "插入連結",
    text: "連結文本",
    url: "連結地址",
    unLink: "取消連結",
    edit: "修改連結",
    view: "查看連結",
  },
  textStyle: {
    bold: "粗體",
    clear: "清除格式",
    code: "行内代碼",
    italic: "斜體",
    sub: "下標",
    sup: "上標",
    through: "刪除線",
    underline: "底線",
  },
  undo: {
    undo: "復原",
    redo: "取消復原",
  },
  todo: {
    todo: "待辦",
  },
  listModule: {
    unOrderedList: "無序列表",
    orderedList: "有序列表",
  },
  tableModule: {
    deleteCol: "删除列",
    deleteRow: "删除行",
    deleteTable: "刪除表格",
    widthAuto: "寬度自動",
    insertCol: "插入列",
    insertRow: "插入行",
    insertTable: "插入表格",
    header: "表頭",
  },
  videoModule: {
    delete: "刪除影像",
    uploadVideo: "上傳影像",
    insertVideo: "插入影像",
    videoSrc: "影像地址",
    videoSrcPlaceHolder: "影像文件 url 或第三方 <iframe>",
    videoPoster: "影像封面",
    videoPosterPlaceHolder: "封面圖片 url",
    ok: "確定",
    editSize: "修改尺寸",
    width: "寬度",
    height: "高度",
  },
  uploadImgModule: {
    uploadImage: "上傳圖片",
    uploadError: "{{fileName}} 上傳出錯",
  },
  highLightModule: {
    selectLang: "選擇語言",
  },
});

i18nChangeLanguage("zh-TW");

interface EditorProps {
  value?: string;
  onChange?: (value: any) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: [
      "undo",
      "redo",
      "|",
      "headerSelect",
      "blockquote",
      "|",
      "bold",
      "underline",
      "italic",
      {
        key: "group-more-style",
        title: "更多",
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path></svg>',
        menuKeys: ["through", "code", "sup", "sub", "clearStyle"],
      },
      "color",
      "bgColor",
      "|",
      "fontSize",
      "fontFamily",
      "lineHeight",
      "|",
      "bulletedList",
      "numberedList",
      "todo",
      {
        key: "group-justify",
        title: "對齊",
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
        menuKeys: [
          "justifyLeft",
          "justifyCenter",
          "justifyRight",
          "justifyJustify",
        ],
      },
      {
        key: "group-indent",
        title: "縮排",
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>',
        menuKeys: ["indent", "delIndent"],
      },
      "|",
      "emotion",
      "insertLink",
      {
        key: "group-image",
        title: "圖片",
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
        menuKeys: ["insertImage", "uploadImage"],
      },
      "insertTable",
      "codeBlock",
      "divider",
    ],
  };

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: "請輸入内容...",
    MENU_CONF: {
      uploadImage: {
        //上傳圖片server設定，不設定會抱錯
        server: "/api/upload",
        fieldName: "file",
        // 小于该值就插入 base64 格式（而不上传），默认为 0
        base64LimitSize: 0, // 1KB
      },
    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <div
      style={{
        backgroundColor: "rgb(245, 245, 245)",
        border: "1px solid #eceff1",
        zIndex: 100,
      }}
    >
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: "1px solid #eceff1" }}
      />
      <Wangeditor
        value={value}
        defaultConfig={editorConfig}
        onCreated={setEditor}
        onChange={onChange}
        mode="default"
        style={{
          height: "900px",
          //margin: " 30px auto 150px auto",
          //backgroundColor: "#fff",
          //border: "1px solid #e8e8e8",
          overflowY: "hidden",
        }}
      />
    </div>
  );
};

export default Editor;
