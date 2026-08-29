"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Quote,
    Link as LinkIcon,
    Unlink,
    Image as ImageIcon,
    Code,
    Undo,
    Redo,
    RemoveFormatting,
    Minus,
    Table as TableIcon,
    Maximize2,
    Minimize2,
    Type,
    Palette,
    Highlighter,
    Eye,
    FileCode,
    Sparkles,
    AlertCircle,
    Info,
    Video,
    Play,
    Film,
    X
} from "lucide-react";
import { MediaPickerModal } from "./media-picker-modal";
import { getVideoEmbedInfo } from "@/lib/utils";

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    label?: string;
    placeholder?: string;
    minHeight?: string;
}

export function RichTextEditor({
    value,
    onChange,
    label = "Nội dung bài viết",
    placeholder = "Nhập nội dung bài viết tại đây...",
    minHeight = "400px"
}: RichTextEditorProps) {
    const [mode, setMode] = useState<"visual" | "code">("visual");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [linkModalOpen, setLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [linkText, setLinkText] = useState("");
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [videoInputUrl, setVideoInputUrl] = useState("");
    const [videoCaption, setVideoCaption] = useState("");
    const [savedSelection, setSavedSelection] = useState<Range | null>(null);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [highlightPickerOpen, setHighlightPickerOpen] = useState(false);

    const editorRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial content setup & external update sync
    useEffect(() => {
        if (editorRef.current && mode === "visual") {
            if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value || "";
            }
        }
    }, [value, mode]);

    const handleContentChange = useCallback(() => {
        if (mode === "visual" && editorRef.current) {
            const html = editorRef.current.innerHTML;
            onChange(html);
        }
    }, [mode, onChange]);

    // Save selection before opening modals
    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            setSavedSelection(sel.getRangeAt(0).cloneRange());
        }
    };

    const restoreSelection = () => {
        if (savedSelection) {
            const sel = window.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(savedSelection);
            }
        }
    };

    // Execute standard command
    const executeCommand = (command: string, value: string | undefined = undefined) => {
        if (mode !== "visual") return;
        if (editorRef.current) {
            editorRef.current.focus();
        }
        document.execCommand(command, false, value);
        handleContentChange();
    };

    // Block formatting
    const applyBlockFormat = (tag: string) => {
        if (mode !== "visual") return;
        if (tag === "lead") {
            executeCommand("formatBlock", "<p>");
            // Apply lead class to current paragraph
            const sel = window.getSelection();
            if (sel && sel.anchorNode) {
                let node: Node | null = sel.anchorNode;
                while (node && node !== editorRef.current) {
                    if (node.nodeName === "P") {
                        (node as HTMLElement).className = "lead text-lg font-medium text-[var(--color-text)] leading-relaxed my-3";
                        break;
                    }
                    node = node.parentNode;
                }
            }
        } else if (tag === "tip-box") {
            const tipHtml = `<div class="p-4 my-4 rounded-xl bg-orange-500/10 border-l-4 border-[var(--color-primary)] text-small font-medium text-[var(--color-text)]"><p class="font-bold text-[var(--color-primary)] mb-1">💡 Lời khuyên từ chuyên gia:</p><p>Nhập ghi chú quan trọng tại đây...</p></div><p><br></p>`;
            executeCommand("insertHTML", tipHtml);
        } else {
            executeCommand("formatBlock", `<${tag}>`);
        }
        handleContentChange();
    };

    // Insert Image from Media Library
    const handleInsertImage = (url: string) => {
        restoreSelection();
        if (mode === "visual") {
            const imageHtml = `<figure class="my-5 text-center"><img src="${url}" alt="Hình ảnh bài viết" class="rounded-xl shadow-md mx-auto max-w-full h-auto object-cover" /><figcaption class="text-xs text-gray-500 mt-2 italic">Chú thích ảnh: DuaxCar Kitchen</figcaption></figure><p><br></p>`;
            executeCommand("insertHTML", imageHtml);
        } else {
            const imageHtml = `\n<figure class="my-5 text-center">\n  <img src="${url}" alt="Hình ảnh bài viết" class="rounded-xl shadow-md mx-auto max-w-full h-auto object-cover" />\n  <figcaption class="text-xs text-gray-500 mt-2 italic">Chú thích ảnh: DuaxCar Kitchen</figcaption>\n</figure>\n`;
            if (textareaRef.current) {
                const start = textareaRef.current.selectionStart;
                const end = textareaRef.current.selectionEnd;
                const text = textareaRef.current.value;
                const nextVal = text.substring(0, start) + imageHtml + text.substring(end);
                onChange(nextVal);
            }
        }
        setMediaPickerOpen(false);
    };

    // Insert Link
    const handleInsertLinkSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!linkUrl) return;
        restoreSelection();
        const finalUrl = linkUrl.startsWith("http://") || linkUrl.startsWith("https://") || linkUrl.startsWith("/") 
            ? linkUrl 
            : `https://${linkUrl}`;
            
        if (linkText && savedSelection?.collapsed) {
            const linkHtml = `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer" class="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]">${linkText}</a>`;
            executeCommand("insertHTML", linkHtml);
        } else {
            executeCommand("createLink", finalUrl);
        }
        setLinkModalOpen(false);
        setLinkUrl("");
        setLinkText("");
    };

    // Insert Video (Cloudflare R2 / MP4 / YouTube / Vimeo)
    const handleInsertVideoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoInputUrl || !videoInputUrl.trim()) return;
        restoreSelection();

        const cleanUrl = videoInputUrl.trim();
        const videoInfo = getVideoEmbedInfo(cleanUrl);
        let videoHtml = "";

        if (videoInfo.type === "youtube" || videoInfo.type === "vimeo") {
            videoHtml = `
                <div class="my-6 rounded-2xl overflow-hidden shadow-xl border border-[var(--color-border)] aspect-video bg-black">
                    <iframe src="${videoInfo.embedUrl}" class="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                ${videoCaption ? `<p class="text-xs text-center text-[var(--color-text-secondary)] italic mt-2">${videoCaption}</p>` : ''}
                <p><br></p>
            `;
        } else {
            // Cloudflare R2 / MP4 / Direct Video link
            videoHtml = `
                <div class="my-6 rounded-2xl overflow-hidden shadow-xl border border-[var(--color-border)] bg-black">
                    <video controls playsinline preload="metadata" class="w-full h-auto max-h-[520px] object-contain mx-auto" src="${cleanUrl}">
                        Trình duyệt của bạn không hỗ trợ phát video HTML5.
                    </video>
                    ${videoCaption ? `<div class="p-2.5 text-center text-xs text-[var(--color-text-secondary)] italic bg-[var(--color-surface)] border-t border-[var(--color-border)]">${videoCaption}</div>` : ''}
                </div>
                <p><br></p>
            `;
        }

        if (mode === "visual") {
            executeCommand("insertHTML", videoHtml);
        } else {
            if (textareaRef.current) {
                const start = textareaRef.current.selectionStart;
                const end = textareaRef.current.selectionEnd;
                const text = textareaRef.current.value;
                const nextVal = text.substring(0, start) + `\n${videoHtml}\n` + text.substring(end);
                onChange(nextVal);
            }
        }

        setVideoModalOpen(false);
        setVideoInputUrl("");
        setVideoCaption("");
    };

    // Insert Table
    const handleInsertTable = () => {
        const tableHtml = `
            <table class="w-full my-4 border-collapse border border-[var(--color-border)] rounded-lg overflow-hidden text-small">
                <thead>
                    <tr class="bg-[var(--color-surface-light)] border-b border-[var(--color-border)]">
                        <th class="p-2.5 border border-[var(--color-border)] font-bold text-left">Tiêu đề 1</th>
                        <th class="p-2.5 border border-[var(--color-border)] font-bold text-left">Tiêu đề 2</th>
                        <th class="p-2.5 border border-[var(--color-border)] font-bold text-left">Tiêu đề 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="p-2.5 border border-[var(--color-border)]">Dữ liệu 1</td>
                        <td class="p-2.5 border border-[var(--color-border)]">Dữ liệu 2</td>
                        <td class="p-2.5 border border-[var(--color-border)]">Dữ liệu 3</td>
                    </tr>
                    <tr>
                        <td class="p-2.5 border border-[var(--color-border)]">Dữ liệu 4</td>
                        <td class="p-2.5 border border-[var(--color-border)]">Dữ liệu 5</td>
                        <td class="p-2.5 border border-[var(--color-border)]">Dữ liệu 6</td>
                    </tr>
                </tbody>
            </table>
            <p><br></p>
        `;
        executeCommand("insertHTML", tableHtml);
    };

    // Calculate word & char count
    const getStats = () => {
        const cleanText = (value || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
        const chars = cleanText.length;
        const words = cleanText ? cleanText.split(/\s+/).length : 0;
        return { chars, words };
    };

    const stats = getStats();

    const colorPalette = [
        { label: "Mặc định", color: "inherit" },
        { label: "Cam DuaxCar", color: "#f97316" },
        { label: "Đỏ", color: "#ef4444" },
        { label: "Xanh lá", color: "#10b981" },
        { label: "Xanh dương", color: "#3b82f6" },
        { label: "Tím", color: "#8b5cf6" },
        { label: "Xám đậm", color: "#374151" },
        { label: "Vàng", color: "#eab308" }
    ];

    const highlightPalette = [
        { label: "Không màu", color: "transparent" },
        { label: "Vàng chanh", color: "rgba(254, 240, 138, 0.4)" },
        { label: "Cam nhạt", color: "rgba(254, 215, 170, 0.4)" },
        { label: "Xanh lục nhạt", color: "rgba(187, 247, 208, 0.4)" },
        { label: "Xanh dương nhạt", color: "rgba(191, 219, 254, 0.4)" },
        { label: "Hồng nhạt", color: "rgba(251, 207, 232, 0.4)" }
    ];

    return (
        <div 
            ref={containerRef}
            className={`flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden transition-all duration-200 ${
                isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen bg-[var(--color-surface)]" : "relative shadow-sm"
            }`}
        >
            {/* Top Bar: Editor Header & Tabs */}
            <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-[var(--color-background)] border-b border-[var(--color-border)] gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--color-text)] flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                        {label}
                    </span>
                    <span className="text-[10px] text-[var(--color-text-muted)] bg-[var(--color-surface)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                        Chuẩn WordPress WYSIWYG
                    </span>
                </div>

                {/* Mode Switcher & Fullscreen */}
                <div className="flex items-center gap-2">
                    <div className="flex p-0.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs font-semibold">
                        <button
                            type="button"
                            onClick={() => {
                                if (mode !== "visual") {
                                    setMode("visual");
                                }
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                                mode === "visual"
                                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                            }`}
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Trực quan (Visual)</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (mode !== "code") {
                                    setMode("code");
                                }
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
                                mode === "code"
                                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                            }`}
                        >
                            <Code className="w-3.5 h-3.5" />
                            <span>Mã HTML (Code)</span>
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] border border-transparent hover:border-[var(--color-border)] transition"
                        title={isFullscreen ? "Thu nhỏ cửa sổ" : "Mở rộng toàn màn hình"}
                    >
                        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* WYSIWYG Formatting Toolbar (Shown in Visual mode) */}
            {mode === "visual" && (
                <div className="p-1.5 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex flex-wrap items-center gap-1 text-xs sticky top-0 z-10 select-none">
                    {/* History */}
                    <div className="flex items-center gap-0.5 border-r border-[var(--color-border)] pr-1.5 mr-0.5">
                        <button
                            type="button"
                            onClick={() => executeCommand("undo")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Hoàn tác (Ctrl+Z)"
                        >
                            <Undo className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => executeCommand("redo")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Làm lại (Ctrl+Y)"
                        >
                            <Redo className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Block Headings dropdown */}
                    <div className="border-r border-[var(--color-border)] pr-1.5 mr-0.5">
                        <select
                            onChange={(e) => {
                                applyBlockFormat(e.target.value);
                                e.target.value = "";
                            }}
                            defaultValue=""
                            className="bg-[var(--color-background)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-semibold rounded-md px-2 py-1 focus:outline-none focus:border-[var(--color-primary)] cursor-pointer"
                        >
                            <option value="" disabled>Kiểu đoạn văn...</option>
                            <option value="p">Đoạn văn (Paragraph)</option>
                            <option value="lead">Đoạn mở đầu (Lead)</option>
                            <option value="h2">Tiêu đề lớn (Heading 2)</option>
                            <option value="h3">Tiêu đề vừa (Heading 3)</option>
                            <option value="h4">Tiêu đề nhỏ (Heading 4)</option>
                            <option value="blockquote">Trích dẫn (Quote)</option>
                            <option value="pre">Khối mã nguồn (Code)</option>
                            <option value="tip-box">Hộp lời khuyên (Tip Box)</option>
                        </select>
                    </div>

                    {/* Basic Styling: Bold, Italic, Underline, Strike */}
                    <div className="flex items-center gap-0.5 border-r border-[var(--color-border)] pr-1.5 mr-0.5">
                        <button
                            type="button"
                            onClick={() => executeCommand("bold")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] font-bold transition"
                            title="In đậm (Ctrl+B)"
                        >
                            <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => executeCommand("italic")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="In nghiêng (Ctrl+I)"
                        >
                            <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => executeCommand("underline")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Gạch chân (Ctrl+U)"
                        >
                            <Underline className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => executeCommand("strikeThrough")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Gạch ngang chữ"
                        >
                            <Strikethrough className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Colors & Highlighter */}
                    <div className="flex items-center gap-0.5 border-r border-[var(--color-border)] pr-1.5 mr-0.5 relative">
                        {/* Text Color */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setColorPickerOpen(!colorPickerOpen);
                                    setHighlightPickerOpen(false);
                                }}
                                className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] flex items-center gap-1 transition"
                                title="Màu chữ"
                            >
                                <Palette className="w-3.5 h-3.5 text-orange-500" />
                            </button>
                            {colorPickerOpen && (
                                <div className="absolute top-full left-0 mt-1 p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl z-30 grid grid-cols-4 gap-1.5 w-44 animate-scaleIn">
                                    {colorPalette.map((c) => (
                                        <button
                                            key={c.color}
                                            type="button"
                                            onClick={() => {
                                                executeCommand("foreColor", c.color);
                                                setColorPickerOpen(false);
                                            }}
                                            className="w-8 h-8 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:scale-110 transition"
                                            style={{ backgroundColor: c.color === "inherit" ? "transparent" : c.color }}
                                            title={c.label}
                                        >
                                            {c.color === "inherit" && <Type className="w-4 h-4 text-[var(--color-text)]" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Highlight */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setHighlightPickerOpen(!highlightPickerOpen);
                                    setColorPickerOpen(false);
                                }}
                                className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] flex items-center gap-1 transition"
                                title="Màu nền nổi bật (Highlighter)"
                            >
                                <Highlighter className="w-3.5 h-3.5 text-amber-500" />
                            </button>
                            {highlightPickerOpen && (
                                <div className="absolute top-full left-0 mt-1 p-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl z-30 grid grid-cols-3 gap-1.5 w-44 animate-scaleIn">
                                    {highlightPalette.map((c) => (
                                        <button
                                            key={c.color}
                                            type="button"
                                            onClick={() => {
                                                executeCommand("hiliteColor", c.color);
                                                setHighlightPickerOpen(false);
                                            }}
                                            className="h-7 rounded-md border border-[var(--color-border)] text-[9px] font-bold flex items-center justify-center hover:scale-105 transition"
                                            style={{ backgroundColor: c.color }}
                                            title={c.label}
                                        >
                                            {c.label.split(" ")[0]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Alignment */}
                    <div className="flex items-center gap-0.5 border-r border-[var(--color-border)] pr-1.5 mr-0.5">
                        <button
                            type="button"
                            onClick={() => executeCommand("justifyLeft")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Căn trái"
                        >
                            <AlignLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => executeCommand("justifyCenter")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Căn giữa"
                        >
                            <AlignCenter className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => executeCommand("justifyRight")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Căn phải"
                        >
                            <AlignRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => executeCommand("justifyFull")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Căn đều hai bên"
                        >
                            <AlignJustify className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Lists */}
                    <div className="flex items-center gap-0.5 border-r border-[var(--color-border)] pr-1.5 mr-0.5">
                        <button
                            type="button"
                            onClick={() => executeCommand("insertUnorderedList")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Danh sách dấu chấm (Bullet List)"
                        >
                            <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => executeCommand("insertOrderedList")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Danh sách số (Numbered List)"
                        >
                            <ListOrdered className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Insert Media, Links, Table, HR */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => {
                                saveSelection();
                                setMediaPickerOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-md bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] flex items-center gap-1 font-semibold transition shadow-sm"
                            title="Chèn hình ảnh từ Thư viện Media DuaxCar"
                        >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>Thêm ảnh</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                saveSelection();
                                setVideoModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1 font-semibold transition shadow-sm"
                            title="Chèn Video (Cloudflare R2 / YouTube / MP4)"
                        >
                            <Video className="w-3.5 h-3.5" />
                            <span>Chèn Video</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                saveSelection();
                                const sel = window.getSelection();
                                if (sel && !sel.isCollapsed) {
                                    setLinkText(sel.toString());
                                }
                                setLinkModalOpen(true);
                            }}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Thêm liên kết (Link)"
                        >
                            <LinkIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => executeCommand("unlink")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Xóa liên kết"
                        >
                            <Unlink className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => executeCommand("insertHorizontalRule")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Chèn đường kẻ ngang phân cách"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleInsertTable}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                            title="Chèn bảng dữ liệu mẫu (Table)"
                        >
                            <TableIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => executeCommand("removeFormat")}
                            className="p-1.5 rounded hover:bg-[var(--color-surface-light)] text-[var(--color-text-secondary)] hover:text-red-500 transition"
                            title="Xóa định dạng đang chọn"
                        >
                            <RemoveFormatting className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Editor Body */}
            <div className="flex-1 relative overflow-auto">
                {mode === "visual" ? (
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleContentChange}
                        onBlur={handleContentChange}
                        data-placeholder={placeholder}
                        style={{ minHeight }}
                        className="p-5 sm:p-7 outline-none font-body text-small text-[var(--color-text)] leading-relaxed prose max-w-none focus:ring-0 empty:before:content-[attr(data-placeholder)] empty:before:text-[var(--color-text-muted)] cursor-text select-text"
                    />
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="<p>Nhập mã HTML bài viết tại đây...</p>"
                        style={{ minHeight }}
                        className="w-full h-full p-4 font-mono text-xs text-[var(--color-text)] bg-[var(--color-background)] focus:outline-none resize-none leading-relaxed"
                    />
                )}
            </div>

            {/* Editor Footer Status Bar */}
            <div className="px-3 py-1.5 bg-[var(--color-background)] border-t border-[var(--color-border)] flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
                <div className="flex items-center gap-3">
                    <span>Số từ: <strong className="text-[var(--color-text)] font-mono">{stats.words}</strong></span>
                    <span>Ký tự: <strong className="text-[var(--color-text)] font-mono">{stats.chars}</strong></span>
                    <span className="hidden sm:inline">Chế độ: <strong className="text-[var(--color-primary)] font-semibold">{mode === "visual" ? "WYSIWYG Soạn thảo trực quan" : "Mã nguồn HTML"}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Đã sẵn sàng
                    </span>
                </div>
            </div>

            {/* Media Picker Modal for Image Insertion */}
            <MediaPickerModal
                isOpen={mediaPickerOpen}
                onClose={() => setMediaPickerOpen(false)}
                onSelect={(url) => handleInsertImage(url)}
                title="Chọn hình ảnh chèn vào bài viết"
            />

            {/* Link Inserter Dialog */}
            {linkModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 w-full max-w-md shadow-2xl space-y-4 animate-scaleIn">
                        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2.5">
                            <h3 className="font-heading font-bold text-sm text-[var(--color-text)] flex items-center gap-1.5">
                                <LinkIcon className="w-4 h-4 text-[var(--color-primary)]" />
                                <span>Chèn liên kết (Hyperlink)</span>
                            </h3>
                        </div>
                        <form onSubmit={handleInsertLinkSubmit} className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Đường dẫn URL (Web link)</label>
                                <input
                                    type="text"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://duaxcar.vn/khoa-hoc/..."
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                    autoFocus
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">Văn bản hiển thị (Tùy chọn)</label>
                                <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    placeholder="Ví dụ: Đăng ký khóa học bún phở..."
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] focus:outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
                                <button
                                    type="button"
                                    onClick={() => setLinkModalOpen(false)}
                                    className="btn btn-secondary btn-sm px-3 text-xs rounded-lg"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm px-4 text-xs rounded-lg shadow-sm"
                                >
                                    Chèn liên kết
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Video Inserter Dialog (Cloudflare R2, YouTube, MP4) */}
            {videoModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 w-full max-w-lg shadow-2xl space-y-4 animate-scaleIn">
                        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
                            <h3 className="font-heading font-bold text-sm text-[var(--color-text)] flex items-center gap-2">
                                <Video className="w-4 h-4 text-purple-500" />
                                <span>Chèn Video vào nội dung (Cloudflare R2 / YouTube / MP4)</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setVideoModalOpen(false)}
                                className="p-1 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleInsertVideoSubmit} className="space-y-3.5">
                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text)] block mb-1">
                                    Đường dẫn Video (URL) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={videoInputUrl}
                                    onChange={(e) => setVideoInputUrl(e.target.value)}
                                    placeholder="Dán link Cloudflare R2 (https://...r2.dev/video.mp4) hoặc YouTube..."
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-text)] focus:border-purple-500 focus:outline-none"
                                    autoFocus
                                    required
                                />
                                <div className="mt-1.5 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-400 space-y-1">
                                    <div className="font-medium flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Hỗ trợ các nguồn video:
                                    </div>
                                    <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-[var(--color-text-secondary)]">
                                        <li><strong>Cloudflare R2:</strong> Dán link public file MP4/WebM từ R2 Bucket (e.g. <code>https://pub-xxxx.r2.dev/video.mp4</code>)</li>
                                        <li><strong>YouTube / Shorts:</strong> Dán link video YouTube (e.g. <code>https://youtu.be/...</code> hoặc <code>youtube.com/watch?v=...</code>)</li>
                                        <li><strong>Direct Video:</strong> Mọi link file MP4, WebM, M3U8 từ CDN hoặc server lưu trữ</li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-[var(--color-text-secondary)] block mb-1">
                                    Chú thích / Tiêu đề video (Tùy chọn)
                                </label>
                                <input
                                    type="text"
                                    value={videoCaption}
                                    onChange={(e) => setVideoCaption(e.target.value)}
                                    placeholder="Ví dụ: Kỹ thuật hầm nước dùng phở bò thực tế tại xưởng..."
                                    className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--color-text)] focus:border-purple-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
                                <button
                                    type="button"
                                    onClick={() => setVideoModalOpen(false)}
                                    className="btn btn-secondary btn-sm px-3 text-xs rounded-xl"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="btn bg-purple-600 hover:bg-purple-700 text-white btn-sm px-4 text-xs rounded-xl shadow-md flex items-center gap-1.5"
                                >
                                    <Play className="w-3 h-3 fill-current" />
                                    <span>Chèn Video vào bài</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
