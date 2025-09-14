import os
import fitz  # PyMuPDF
import tkinter as tk
from tkinter import filedialog
from datetime import datetime
from PIL import Image  # Pillow

def extract_images_from_pdf(pdf_path, base_output):
    # Get PDF name and clean spaces
    pdf_name = os.path.splitext(os.path.basename(pdf_path))[0].replace(" ", "_")

    # Get modification year of the PDF
    mod_time = os.path.getmtime(pdf_path)
    year = datetime.fromtimestamp(mod_time).strftime("%Y")

    # Create output folder: base/year/pdf_name
    output_dir = os.path.join(base_output, year, pdf_name)
    os.makedirs(output_dir, exist_ok=True)

    doc = fitz.open(pdf_path)
    img_count = 0

    for page_num in range(len(doc)):
        images = doc[page_num].get_images(full=True)
        for img_index, img in enumerate(images, start=1):
            xref = img[0]
            pix = fitz.Pixmap(doc, xref)

            # Convert CMYK to RGB if needed
            if pix.n >= 4:
                pix = fitz.Pixmap(fitz.csRGB, pix)

            # Save temporarily as PNG
            temp_filename = os.path.join(output_dir, f"page{page_num+1}_img{img_index}.png")
            pix.save(temp_filename)

            # Convert to WebP with Pillow
            with Image.open(temp_filename) as im:
                webp_filename = temp_filename.replace(".png", ".webp")
                im.save(webp_filename, "WEBP", quality=80)

            # Remove the temporary PNG
            os.remove(temp_filename)

            img_count += 1

    print(f"✅ Extracted {img_count} images to: {output_dir}")


def main():
    # Hide Tkinter root window
    root = tk.Tk()
    root.withdraw()

    # Select PDF file
    pdf_path = filedialog.askopenfilename(
        title="Select a PDF file",
        filetypes=[("PDF files", "*.pdf")]
    )

    if not pdf_path:
        print("❌ No file selected.")
        return

    # Fixed base output folder
    base_output = os.path.join("src", "assets", "images")

    extract_images_from_pdf(pdf_path, base_output)


if __name__ == "__main__":
    main()
