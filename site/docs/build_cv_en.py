"""Build the public, selectable English CV from the supplied 2026 Chinese CV.

Run with the bundled Python environment: python docs/build_cv_en.py
The source JPG/PDF remains outside the hosted site; this file is the editable
English transcription used for the PDF linked from the CV section.
"""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT = Path(__file__).resolve().parents[1] / "assets" / "canqi-lin-cv-2026-en.pdf"
PAGE_WIDTH, PAGE_HEIGHT = A4
LEFT = RIGHT = 19 * mm
TOP = 17 * mm
BOTTOM = 17 * mm
CONTENT_WIDTH = PAGE_WIDTH - LEFT - RIGHT
INK = colors.HexColor("#1b1b19")
MUTED = colors.HexColor("#55554f")
RULE = colors.HexColor("#aaaaa2")


def style(name, **kwargs):
    settings = {"fontName": "Helvetica", "textColor": INK}
    settings.update(kwargs)
    return ParagraphStyle(name, **settings)


NAME = style("name", fontName="Helvetica-Bold", fontSize=30, leading=32, spaceAfter=7)
SUBTITLE = style("subtitle", fontSize=9.5, leading=14, textColor=MUTED, spaceAfter=8)
CONTACT = style("contact", fontSize=8.3, leading=12, spaceAfter=0)
PAGE_TITLE = style("page_title", fontName="Helvetica-Bold", fontSize=20, leading=24, spaceAfter=4)
SECTION = style("section", fontName="Helvetica-Bold", fontSize=11.3, leading=14, spaceAfter=5)
BODY = style("body", fontSize=8.8, leading=12.5, spaceAfter=0)
DATE = style("date", fontName="Helvetica-Bold", fontSize=8, leading=11, textColor=MUTED)
ENTRY_TITLE = style("entry_title", fontName="Helvetica-Bold", fontSize=9.2, leading=12.3)
ENTRY_BODY = style("entry_body", fontSize=8.3, leading=11.6, textColor=MUTED)
SMALL = style("small", fontSize=8, leading=11.5, textColor=MUTED)


story = []


def section(title):
    story.extend(
        [
            Spacer(1, 13),
            Paragraph(title, SECTION),
            HRFlowable(width="100%", thickness=0.6, color=RULE),
            Spacer(1, 7),
        ]
    )


def entry(date, title, detail):
    body = [Paragraph(title, ENTRY_TITLE), Spacer(1, 3), Paragraph(detail, ENTRY_BODY)]
    table = Table(
        [[Paragraph(date, DATE), body]],
        colWidths=[91, CONTENT_WIDTH - 91],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, -1), 12),
                ("RIGHTPADDING", (1, 0), (1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
                ("LINEBELOW", (0, 0), (-1, -1), 0.35, RULE),
            ]
        )
    )
    story.append(table)


story.extend(
    [
        Paragraph("CANQI LIN", NAME),
        Paragraph(
            "PERFORMATIVE INSTALLATION ARTIST / SPATIAL DESIGNER / EXPERIMENTAL THEATRE DIRECTOR",
            SUBTITLE,
        ),
        Paragraph(
            "Guangzhou, China&nbsp;&nbsp; | &nbsp;&nbsp;+86 188 2002 6137&nbsp;&nbsp; | "
            "&nbsp;&nbsp;louvslefv@gmail.com&nbsp;&nbsp; | &nbsp;&nbsp;Instagram @lcanqi",
            CONTACT,
        ),
        Spacer(1, 13),
        HRFlowable(width="100%", thickness=1, color=INK),
        Spacer(1, 11),
        Paragraph(
            "Canqi Lin works across spatial performance, installation art, digital media and retail environments. "
            "His practice combines physical space with interaction and visual storytelling to examine the links "
            "between people, technology, ecology and social life.",
            BODY,
        ),
    ]
)

section("EDUCATION")
entry(
    "2021 - 2023",
    "MFA, Spatial Performance and Design",
    "Architectural Association School of Architecture (AA), AAIS Interprofessional Studio, London. "
    "Participated in and was invited to more than seven exhibitions and presentations during the programme.",
)
entry(
    "2017 - 2021",
    "BA, Environmental Art and Design",
    "School of Architecture and Applied Arts, Guangzhou Academy of Fine Arts. "
    "Outstanding student and first-class scholarship recipient.",
)

section("PROFESSIONAL EXPERIENCE")
entry(
    "Apr 2026 - present",
    "Digital Arts Teaching and Curriculum Development - SFK International Art Education",
    "Planning the digital-media curriculum, developing educational products and coordinating academic projects, "
    "faculty partnerships and programme delivery.",
)
entry(
    "Apr 2024 - Apr 2026",
    "Digital Media Project Mentor - SFK International Art Education",
    "Mentored installation, spatial-performance and digital-media projects; supported student portfolios, "
    "applications and public presentations.",
)
entry(
    "Oct - Dec 2024",
    "Externally Appointed Lecturer - Guangzhou Academy of Fine Arts",
    "School of Architecture and Applied Arts. Designed and taught interdisciplinary courses and lectures "
    "connecting space, architecture, environmental art, digital media and installation design.",
)
entry(
    "2023 - Mar 2024",
    "Spatial Designer - HEYTEA, Shenzhen Headquarters",
    "Worked on retail interiors, store displays, spatial standards, materials, concept design and "
    "cross-team coordination for the brand's stores.",
)

story.append(PageBreak())
story.append(Paragraph("SELECTED PROJECTS &amp; PRESENTATIONS", PAGE_TITLE))
story.append(Paragraph("CANQI LIN / CV 2026", SUBTITLE))
story.append(HRFlowable(width="100%", thickness=1, color=INK))
story.append(Spacer(1, 8))

entry(
    "Oct 2026 / ongoing",
    "Leather project: world",
    "MEILISHUO immersive installation and exhibition-hall design for the Canton Fair, Guangzhou.",
)
entry(
    "Jan 2026",
    "MIAO",
    "Commercial display and installation design, Guangzhou; design and on-site production.",
)
entry(
    "Oct 2025",
    "Fishbird [Sumeru]",
    "Curatorial work, exhibition-space design and installation production for BUZHITANSUO art space, Guangzhou.",
)
entry(
    "Dec 2024",
    "Carnival Nervous System",
    "Large-scale art-installation exhibition design and production.",
)
entry(
    "Jan 2024",
    "Zen Machine",
    "Interactive installation presented in the 'Uncertain Variables' exhibition at Artsect Gallery.",
)
entry(
    "Mar - May 2023",
    "The Gavel Room",
    "Experimental theatre and installation. Project creator, director and stage designer. A related work "
    "was presented at The Crypt Gallery's POLYPHONIC sound-art exhibition in London; an interactive "
    "installation was selected by LAC Mayfair for a London Design Festival invitation.",
)
entry(
    "Aug 2022",
    "The Floating Life",
    "Edinburgh Festival Fringe. Project management, lighting design and photography.",
)
entry(
    "Mar - May 2022",
    "POWER OFF / POWER OFF - B.S.O.D.",
    "Immersive theatre and installation in Glasgow and London. Project founder, director, "
    "co-curator and spatial-installation designer.",
)

section("PRACTICE &amp; TOOLS")
story.extend(
    [
        Paragraph(
            "Spatial performance, exhibition and installation design, digital interaction, narrative concepts, "
            "stage design, interior and retail environments. Tools include Adobe Creative Cloud, CAD, "
            "SketchUp, Rhino, TouchDesigner, Blender and AI-assisted workflows.",
            SMALL,
        ),
        Spacer(1, 5),
        Paragraph("Languages: Chinese and English (IELTS 6.5, 2021).", SMALL),
    ]
)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.5)
    canvas.line(LEFT, 14 * mm, PAGE_WIDTH - RIGHT, 14 * mm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(LEFT, 10 * mm, "CANQI LIN / ENGLISH CV / OCT 2026")
    canvas.drawRightString(PAGE_WIDTH - RIGHT, 10 * mm, f"{doc.page:02d}")
    canvas.restoreState()


OUTPUT.parent.mkdir(parents=True, exist_ok=True)
document = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    leftMargin=LEFT,
    rightMargin=RIGHT,
    topMargin=TOP,
    bottomMargin=BOTTOM,
    title="Canqi Lin - English CV 2026",
    author="Canqi Lin",
    subject="English curriculum vitae",
)
document.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
