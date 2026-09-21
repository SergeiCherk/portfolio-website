import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Lightbox from "../Lightbox";

const images = [
  { src: "/photo-1.jpg", caption: "Первое фото" },
  { src: "/photo-2.jpg", caption: "Второе фото" },
];

describe("Lightbox", () => {
  it("показывает фото по текущему индексу и его подпись", () => {
    render(<Lightbox images={images} index={0} onClose={vi.fn()} onNavigate={vi.fn()} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", "/photo-1.jpg");
    expect(screen.getByText("Первое фото")).toBeInTheDocument();
  });

  it("вызывает onClose по клику на фон", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(
      <Lightbox images={images} index={0} onClose={onClose} onNavigate={vi.fn()} />
    );

    await user.click(container.querySelector(".lightbox"));
    expect(onClose).toHaveBeenCalled();
  });

  it("не закрывается по клику на само изображение", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Lightbox images={images} index={0} onClose={onClose} onNavigate={vi.fn()} />);

    await user.click(screen.getByRole("img"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("вызывает onClose по нажатию Esc", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Lightbox images={images} index={0} onClose={onClose} onNavigate={vi.fn()} />);

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("листает вперёд по стрелке →, зацикливаясь на последнем фото", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<Lightbox images={images} index={1} onClose={vi.fn()} onNavigate={onNavigate} />);

    await user.keyboard("{ArrowRight}");
    expect(onNavigate).toHaveBeenCalledWith(0); // после последнего фото — снова первое
  });

  it("не показывает стрелки навигации, если фото всего одно", () => {
    render(<Lightbox images={[images[0]]} index={0} onClose={vi.fn()} onNavigate={vi.fn()} />);
    expect(screen.queryByLabelText("Следующее фото")).not.toBeInTheDocument();
  });
});
