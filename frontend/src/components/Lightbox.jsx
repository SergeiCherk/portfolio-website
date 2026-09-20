import { useEffect } from "react";
import "./Lightbox.css";

/**
 * Полноэкранный просмотр фото поверх страницы.
 * images — массив вида [{ src, caption }], index — текущая позиция.
 * Управление: клик по фону или ✕ — закрыть, стрелки ← → — листать.
 */
export default function Lightbox({ images, index, onClose, onNavigate }) {
  const image = images[index];

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // блокируем скролл страницы под лайтбоксом
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onNavigate]);

  if (!image) return null;

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox__close" onClick={onClose} aria-label="Закрыть просмотр">
        ✕
      </button>

      {images.length > 1 && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          aria-label="Предыдущее фото"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index - 1 + images.length) % images.length);
          }}
        >
          ‹
        </button>
      )}

      <img
        className="lightbox__image"
        src={image.src}
        alt={image.caption || ""}
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <button
          className="lightbox__nav lightbox__nav--next"
          aria-label="Следующее фото"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((index + 1) % images.length);
          }}
        >
          ›
        </button>
      )}

      {image.caption && <p className="lightbox__caption">{image.caption}</p>}
    </div>
  );
}
