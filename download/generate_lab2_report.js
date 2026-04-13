const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
        Header, Footer, PageNumber, Math, MathRun } = require("docx");
const fs = require("fs");

// Палитра ACADEMIC
const P = {
  primary: "000000",
  body: "000000", 
  secondary: "404040",
  accent: "000000",
  surface: "FFFFFF"
};

// Границы для таблиц
const TB = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
const NB = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const thinB = { style: BorderStyle.SINGLE, size: 1, color: "000000" };

// Титульная страница
function buildCover() {
  return [
    new Paragraph({ spacing: { before: 2400 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: "МИНИСТЕРСТВО НАУКИ И ВЫСШЕГО ОБРАЗОВАНИЯ", bold: true, size: 28, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: "РОССИЙСКОЙ ФЕДЕРАЦИИ", bold: true, size: 28, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
      children: [new TextRun({ text: "Федеральное государственное автономное образовательное учреждение", size: 24, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: "высшего образования", size: 24, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: "\"ЮЖНЫЙ ФЕДЕРАЛЬНЫЙ УНИВЕРСИТЕТ\"", bold: true, size: 28, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    }),
    new Paragraph({ spacing: { before: 1200 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: "ОТЧЁТ", bold: true, size: 36, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: "по лабораторной работе № 2", size: 28, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
      children: [new TextRun({ text: "по дисциплине: \"Вычислительная математика\"", size: 24, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: "на тему:", size: 24, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 1200 },
      children: [new TextRun({ text: "\"Численные методы решения нелинейных уравнений\"", bold: true, size: 28, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    }),
    new Paragraph({ spacing: { before: 1600 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      indent: { left: 7200 },
      children: [new TextRun({ text: "Выполнил:", size: 24, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      indent: { left: 7200 },
      spacing: { after: 400 },
      children: [new TextRun({ text: "студент группы БКТб-00", size: 24, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      indent: { left: 7200 },
      spacing: { after: 800 },
      children: [new TextRun({ text: "Проверил:", size: 24, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    }),
    new Paragraph({ spacing: { before: 1600 }, children: [] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Таганрог — 2024", size: 24, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
    })
  ];
}

// Заголовок
function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: 360, after: 120 },
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, bold: true, size: level === HeadingLevel.HEADING_1 ? 28 : 24, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
  });
}

// Подзаголовок
function subheading(text) {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
  });
}

// Обычный текст
function body(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 720 },
    spacing: { line: 360 },
    children: [new TextRun({ text, size: 24, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
  });
}

// Текст без отступа
function bodyNoIndent(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360 },
    children: [new TextRun({ text, size: 24, font: { ascii: "Times New Roman", eastAsia: "Times New Roman" } })]
  });
}

// Пустая строка
function emptyLine() {
  return new Paragraph({ spacing: { line: 360 }, children: [] });
}

// Формула (центрированная)
function formula(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120, line: 360 },
    children: [new TextRun({ text, size: 24, font: { ascii: "Times New Roman", eastAsia: "Times New Roman", italic: true } })]
  });
}

// Таблица результатов методов
function buildMethodsTable() {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: TB, bottom: TB, left: TB, right: TB,
      insideHorizontal: thinB, insideVertical: thinB
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          new TableCell({ 
            shading: { type: ShadingType.CLEAR, fill: "E0E0E0" },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Метод", bold: true, size: 22, font: { ascii: "Times New Roman" } })] })] 
          }),
          new TableCell({ 
            shading: { type: ShadingType.CLEAR, fill: "E0E0E0" },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Корень x*", bold: true, size: 22, font: { ascii: "Times New Roman" } })] })] 
          }),
          new TableCell({ 
            shading: { type: ShadingType.CLEAR, fill: "E0E0E0" },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Итераций", bold: true, size: 22, font: { ascii: "Times New Roman" } })] })] 
          }),
          new TableCell({ 
            shading: { type: ShadingType.CLEAR, fill: "E0E0E0" },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "|f(x*)|", bold: true, size: 22, font: { ascii: "Times New Roman" } })] })] 
          }),
        ]
      }),
      // Данные
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Половинного деления", size: 22, font: { ascii: "Times New Roman" } })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.0811223984", size: 22, font: { ascii: "Times New Roman" } })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "18", size: 22, font: { ascii: "Times New Roman" } })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5.24×10⁻⁷", size: 22, font: { ascii: "Times New Roman" } })] })] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Ньютона (касательных)", size: 22, font: { ascii: "Times New Roman" } })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.0811224788", size: 22, font: { ascii: "Times New Roman" } })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "4", size: 22, font: { ascii: "Times New Roman" } })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.50×10⁻⁹", size: 22, font: { ascii: "Times New Roman" } })] })] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Простой итерации", size: 22, font: { ascii: "Times New Roman" } })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.0811220285", size: 22, font: { ascii: "Times New Roman" } })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "82", size: 22, font: { ascii: "Times New Roman" } })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "2.94×10⁻⁶", size: 22, font: { ascii: "Times New Roman" } })] })] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Хорд (секущих)", size: 22, font: { ascii: "Times New Roman" } })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "1.0811224786", size: 22, font: { ascii: "Times New Roman" } })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "5", size: 22, font: { ascii: "Times New Roman" } })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "9.39×10⁻¹¹", size: 22, font: { ascii: "Times New Roman" } })] })] }),
        ]
      }),
    ]
  });
}

// Основное содержание
function buildBody() {
  return [
    heading("1. ЦЕЛЬ РАБОТЫ"),
    body("Изучение и реализация численных методов решения нелинейных уравнений: метод половинного деления, метод Ньютона (касательных), метод простой итерации и метод хорд. Сравнительный анализ скорости сходимости и точности методов."),
    
    emptyLine(),
    heading("2. ПОСТАНОВКА ЗАДАЧИ"),
    body("Требуется найти корень уравнения:"),
    formula("f(x) = x³ + 1.4x² − 2.9 = 0"),
    body("с заданной точностью ε = 10⁻⁶."),
    
    emptyLine(),
    heading("3. ТЕОРЕТИЧЕСКИЕ СВЕДЕНИЯ"),
    
    subheading("3.1. Метод половинного деления (бисекции)"),
    body("Метод бисекции основан на теореме о промежуточном значении: если непрерывная функция f(x) меняет знак на отрезке [a, b], то существует по крайней мере один корень на этом отрезке."),
    body("Алгоритм метода:"),
    bodyNoIndent("1. Вычислить c = (a + b)/2."),
    bodyNoIndent("2. Если f(c) = 0, корень найден."),
    bodyNoIndent("3. Если f(a)·f(c) < 0, то b = c, иначе a = c."),
    bodyNoIndent("4. Повторять до тех пор, пока |b − a| > ε."),
    body("Скорость сходимости — линейная, число итераций N ≈ log₂((b−a)/ε)."),
    
    subheading("3.2. Метод Ньютона (касательных)"),
    body("Метод Ньютона использует линейную аппроксимацию функции в точке касательной."),
    body("Итерационная формула:"),
    formula("x_{n+1} = x_n − f(x_n) / f'(x_n)"),
    body("Условие сходимости: f(x₀)·f''(x₀) > 0, где x₀ — начальное приближение. Скорость сходимости — квадратичная."),
    
    subheading("3.3. Метод простой итерации"),
    body("Уравнение f(x) = 0 преобразуется к виду x = φ(x)."),
    body("Итерационная формула:"),
    formula("x_{n+1} = φ(x_n)"),
    body("Условие сходимости: |φ'(x)| < 1 на отрезке локализации корня. Скорость сходимости — линейная."),
    
    subheading("3.4. Метод хорд (секущих)"),
    body("Метод хорд использует секущую через две точки графика функции."),
    body("Итерационная формула:"),
    formula("x_{n+1} = x_n − f(x_n) · (x_n − x_{n-1}) / (f(x_n) − f(x_{n-1}))"),
    body("Скорость сходимости — суперлинейная (порядок φ ≈ 1.618 — золотое сечение)."),
    
    emptyLine(),
    heading("4. АНАЛИЗ ФУНКЦИИ И ОТДЕЛЕНИЕ КОРНЕЙ"),
    body("Исходная функция: f(x) = x³ + 1.4x² − 2.9"),
    body("Первая производная: f'(x) = 3x² + 2.8x = x(3x + 2.8)"),
    body("Вторая производная: f''(x) = 6x + 2.8"),
    body("Критические точки (f'(x) = 0): x₁ = 0, x₂ = −2.8/3 ≈ −0.933"),
    body("Для отделения корней составим таблицу значений функции:"),
    
    emptyLine(),
    subheading("Таблица значений функции"),
    bodyNoIndent("x = −3.0:  f(x) = −17.30"),
    bodyNoIndent("x = −2.0:  f(x) = −5.30"),
    bodyNoIndent("x = −1.0:  f(x) = −2.50"),
    bodyNoIndent("x =  0.0:  f(x) = −2.90"),
    bodyNoIndent("x =  1.0:  f(x) = −0.50"),
    bodyNoIndent("x =  1.5:  f(x) =  3.63"),
    
    body("На отрезке [1.0, 1.5] происходит смена знака: f(1.0) = −0.50 < 0, f(1.5) = 3.63 > 0. Следовательно, уравнение имеет один действительный корень на этом отрезке."),
    
    emptyLine(),
    heading("5. РЕЗУЛЬТАТЫ ВЫЧИСЛЕНИЙ"),
    body("Все методы применялись с точностью ε = 10⁻⁶ и максимальным числом итераций 100."),
    
    emptyLine(),
    subheading("5.1. Метод половинного деления"),
    body("Начальный отрезок: [1.0, 1.5]"),
    body("Результат: x* = 1.0811223984"),
    body("Число итераций: 18"),
    body("Проверка: f(x*) = −5.24×10⁻⁷"),
    
    subheading("5.2. Метод Ньютона"),
    body("Начальное приближение: x₀ = 1.5 (условие f(x₀)·f''(x₀) > 0 выполнено)"),
    body("Итерации:"),
    bodyNoIndent("n = 1:  x = 1.1689497717,  f(x) = 6.10×10⁻¹"),
    bodyNoIndent("n = 2:  x = 1.0861645571,  f(x) = 3.31×10⁻²"),
    bodyNoIndent("n = 3:  x = 1.0811404563,  f(x) = 1.17×10⁻⁴"),
    bodyNoIndent("n = 4:  x = 1.0811224788,  f(x) = 1.50×10⁻⁹"),
    body("Результат: x* = 1.0811224788"),
    body("Число итераций: 4"),
    
    subheading("5.3. Метод простой итерации"),
    body("Преобразование уравнения: x = (2.9 − 1.4x²)^(1/3)"),
    body("Начальное приближение: x₀ = 1.0"),
    body("Результат: x* = 1.0811220285"),
    body("Число итераций: 82"),
    body("Примечание: метод сходится медленно из-за того, что |φ'(x)| близок к 1."),
    
    subheading("5.4. Метод хорд"),
    body("Начальные точки: x₀ = 1.0, x₁ = 1.5"),
    body("Итерации:"),
    bodyNoIndent("n = 1:  x = 1.0606060606,  f(x) = −1.32×10⁻¹"),
    bodyNoIndent("n = 2:  x = 1.0760552641,  f(x) = −3.30×10⁻²"),
    bodyNoIndent("n = 3:  x = 1.0811973097,  f(x) =  4.89×10⁻⁴"),
    bodyNoIndent("n = 4:  x = 1.0811222084,  f(x) = −1.77×10⁻⁶"),
    bodyNoIndent("n = 5:  x = 1.0811224786,  f(x) = −9.39×10⁻¹¹"),
    body("Результат: x* = 1.0811224786"),
    body("Число итераций: 5"),
    
    emptyLine(),
    heading("6. СРАВНИТЕЛЬНЫЙ АНАЛИЗ МЕТОДОВ"),
    body("Сводная таблица результатов:"),
    emptyLine(),
    buildMethodsTable(),
    emptyLine(),
    
    emptyLine(),
    heading("7. ВЫВОДЫ"),
    body("1. Уравнение x³ + 1.4x² − 2.9 = 0 имеет один действительный корень x* ≈ 1.081122."),
    body("2. Все методы нашли корень с заданной точностью ε = 10⁻⁶."),
    body("3. Наименьшее число итераций потребовал метод Ньютона (4 итерации) благодаря квадратичной скорости сходимости."),
    body("4. Метод половинного деления (18 итераций) обеспечивает гарантированную сходимость, но требует наибольшего числа итераций."),
    body("5. Метод хорд (5 итераций) показал хорошую эффективность без необходимости вычисления производной."),
    body("6. Метод простой итерации (82 итерации) сходится медленно из-за неудачного выбора функции φ(x), при котором |φ'(x)| близко к 1."),
    body("7. Рекомендации по выбору метода:"),
    bodyNoIndent("• Если нужна гарантия сходимости — метод бисекции."),
    bodyNoIndent("• Если можно вычислить производную — метод Ньютона."),
    bodyNoIndent("• Если производная неизвестна — метод хорд."),
    bodyNoIndent("• Для простоты реализации — метод простой итерации (при удачном выборе φ(x))."),
    
    emptyLine(),
    heading("СПИСОК ИСПОЛЬЗОВАННЫХ ИСТОЧНИКОВ"),
    bodyNoIndent("1. Бахвалов Н.С., Жидков Н.П., Кобельков Г.М. Численные методы. — М.: Бином, 2011."),
    bodyNoIndent("2. Калиткин Н.Н. Численные методы. — СПб.: БХВ-Петербург, 2011."),
    bodyNoIndent("3. Самарский А.А., Гулин А.В. Численные методы. — М.: Наука, 1989."),
  ];
}

// Документ
const doc = new Document({
  styles: {
    default: {
      document: {
        run: {
          font: { ascii: "Times New Roman", eastAsia: "Times New Roman" },
          size: 24
        },
        paragraph: {
          spacing: { line: 360 }
        }
      }
    }
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 1134, bottom: 1134, left: 1701, right: 850 }
        }
      },
      children: buildCover()
    },
    {
      properties: {
        page: {
          margin: { top: 1134, bottom: 1134, left: 1701, right: 850 }
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "Лабораторная работа №2. Численные методы решения нелинейных уравнений", size: 20, font: { ascii: "Times New Roman" } })]
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ children: [PageNumber.CURRENT], size: 20, font: { ascii: "Times New Roman" } })]
          })]
        })
      },
      children: buildBody()
    }
  ]
});

// Сохранение
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/lab2_report.docx", buffer);
  console.log("Отчёт сохранён: /home/z/my-project/download/lab2_report.docx");
});
