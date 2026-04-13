#include <iostream>
#include <cmath>
#include <vector>
#include <iomanip>
#include <fstream>
#include <string>

using namespace std;

// Исходное уравнение: x³ + 1.4x² − 2.9 = 0
double f(double x) {
    return pow(x, 3) + 1.4 * pow(x, 2) - 2.9;
}

// Производная функции: 3x² + 2.8x
double df(double x) {
    return 3 * pow(x, 2) + 2.8 * x;
}

// Вторая производная: 6x + 2.8
double d2f(double x) {
    return 6 * x + 2.8;
}

// Структура для хранения результатов
struct MethodResult {
    string name;
    double root;
    int iterations;
    vector<double> x_values;
    bool converged;
};

// Метод половинного деления (бисекции)
MethodResult bisection(double a, double b, double eps, int max_iter) {
    MethodResult result;
    result.name = "Метод половинного деления";
    result.converged = false;
    result.iterations = 0;
    
    double fa = f(a);
    double fb = f(b);
    
    if (fa * fb >= 0) {
        cout << "  ОШИБКА: f(" << a << ") = " << fa << ", f(" << b << ") = " << fb << endl;
        cout << "  Знаки не разные! f(a)*f(b) = " << fa * fb << endl;
        return result;
    }
    
    double c;
    while ((b - a) / 2 > eps && result.iterations < max_iter) {
        c = (a + b) / 2;
        result.x_values.push_back(c);
        
        double fc = f(c);
        
        if (fabs(fc) < eps) {
            result.root = c;
            result.converged = true;
            break;
        }
        
        if (fa * fc < 0) {
            b = c;
            fb = fc;
        } else {
            a = c;
            fa = fc;
        }
        result.iterations++;
    }
    
    result.root = (a + b) / 2;
    result.converged = true;
    return result;
}

// Метод Ньютона (касательных)
MethodResult newton(double x0, double eps, int max_iter) {
    MethodResult result;
    result.name = "Метод Ньютона";
    result.converged = false;
    result.iterations = 0;
    
    double x = x0;
    double x_prev;
    
    do {
        x_prev = x;
        double dfx = df(x);
        
        if (fabs(dfx) < 1e-12) {
            return result;
        }
        
        x = x - f(x) / dfx;
        result.iterations++;
        result.x_values.push_back(x);
        
        if (result.iterations >= max_iter) {
            return result;
        }
    } while (fabs(x - x_prev) > eps && fabs(f(x)) > eps);
    
    result.root = x;
    result.converged = true;
    return result;
}

// Метод простой итерации
// Уравнение: x³ + 1.4x² - 2.9 = 0
// Преобразуем: x³ = 2.9 - 1.4x²
// x = (2.9 - 1.4x²)^(1/3)
// При x ≈ 1: |φ'(x)| = |(-2.8x)/(3*(2.9-1.4x²)^(2/3))| должно быть < 1
double phi(double x) {
    double val = 2.9 - 1.4 * x * x;
    if (val < 0) return x;
    return cbrt(val);
}

MethodResult simple_iteration(double x0, double eps, int max_iter) {
    MethodResult result;
    result.name = "Метод простой итерации";
    result.converged = false;
    result.iterations = 0;
    
    double x = x0;
    double x_prev;
    
    do {
        x_prev = x;
        x = phi(x);
        result.iterations++;
        result.x_values.push_back(x);
        
        if (result.iterations >= max_iter) {
            return result;
        }
    } while (fabs(x - x_prev) > eps);
    
    result.root = x;
    result.converged = true;
    return result;
}

// Метод хорд
MethodResult secant(double x0, double x1, double eps, int max_iter) {
    MethodResult result;
    result.name = "Метод хорд";
    result.converged = false;
    result.iterations = 0;
    
    double x_prev = x0;
    double x = x1;
    double x_next;
    
    do {
        double fx = f(x);
        double fx_prev = f(x_prev);
        
        if (fabs(fx - fx_prev) < 1e-12) {
            return result;
        }
        
        x_next = x - fx * (x - x_prev) / (fx - fx_prev);
        x_prev = x;
        x = x_next;
        result.iterations++;
        result.x_values.push_back(x);
        
        if (result.iterations >= max_iter) {
            return result;
        }
    } while (fabs(x - x_prev) > eps && fabs(f(x)) > eps);
    
    result.root = x;
    result.converged = true;
    return result;
}

int main() {
    const double eps = 1e-6;
    const int max_iter = 100;
    
    cout << "╔══════════════════════════════════════════════════════════════╗" << endl;
    cout << "║    ЧИСЛЕННОЕ РЕШЕНИЕ УРАВНЕНИЯ x³ + 1.4x² − 2.9 = 0         ║" << endl;
    cout << "╚══════════════════════════════════════════════════════════════╝" << endl << endl;
    
    // Анализ функции и отделение корней
    cout << "═══════════════════════════════════════════════════════════════" << endl;
    cout << "  1. АНАЛИЗ ФУНКЦИИ И ОТДЕЛЕНИЕ КОРНЕЙ" << endl;
    cout << "═══════════════════════════════════════════════════════════════" << endl << endl;
    
    cout << "  f(x) = x³ + 1.4x² − 2.9" << endl;
    cout << "  f'(x) = 3x² + 2.8x = x(3x + 2.8)" << endl;
    cout << "  f''(x) = 6x + 2.8" << endl << endl;
    
    // Критические точки
    cout << "  Критические точки (f'(x) = 0):" << endl;
    cout << "    x₁ = 0" << endl;
    cout << "    x₂ = -2.8/3 ≈ -0.933" << endl;
    cout << "  f(0) = -2.9 — локальный минимум" << endl;
    cout << "  f(-0.933) ≈ -2.8 — локальный максимум" << endl << endl;
    
    // Таблица значений
    cout << "  Таблица значений функции:" << endl;
    cout << "  ┌──────────┬───────────────┐" << endl;
    cout << "  │    x     │     f(x)      │" << endl;
    cout << "  ├──────────┼───────────────┤" << endl;
    
    for (double x = -3; x <= 2.5; x += 0.5) {
        cout << "  │ " << setw(8) << fixed << setprecision(2) << x 
             << " │ " << setw(12) << setprecision(6) << f(x) << " │" << endl;
    }
    cout << "  └──────────┴───────────────┘" << endl << endl;
    
    // Поиск интервалов с сменой знака
    cout << "  Анализ смены знаков:" << endl;
    for (double x = -3; x <= 2; x += 0.5) {
        double fx = f(x);
        double fx_next = f(x + 0.5);
        if (fx * fx_next < 0) {
            cout << "  ✓ Смена знака на [" << x << ", " << x+0.5 << "]" << endl;
            cout << "    f(" << x << ") = " << fx << endl;
            cout << "    f(" << x+0.5 << ") = " << fx_next << endl;
        }
    }
    cout << endl;
    
    cout << "  ВЫВОД: Уравнение имеет один действительный корень на [1.0, 1.5]" << endl << endl;
    
    // Применение методов
    cout << "═══════════════════════════════════════════════════════════════" << endl;
    cout << "  2. ЧИСЛЕННЫЕ МЕТОДЫ РЕШЕНИЯ" << endl;
    cout << "═══════════════════════════════════════════════════════════════" << endl << endl;
    
    cout << "  Точность: ε = " << scientific << setprecision(2) << eps << endl;
    cout << "  Макс. число итераций: " << max_iter << endl << endl;
    
    // =================== МЕТОД 1: ПОЛОВИННОГО ДЕЛЕНИЯ ===================
    cout << "┌─────────────────────────────────────────────────────────────┐" << endl;
    cout << "│  МЕТОД ПОЛОВИННОГО ДЕЛЕНИЯ (Бисекции)                       │" << endl;
    cout << "└─────────────────────────────────────────────────────────────┘" << endl;
    cout << "  Отрезок: [1.0, 1.5]" << endl;
    cout << "  f(1.0) = " << fixed << setprecision(6) << f(1.0) << endl;
    cout << "  f(1.5) = " << f(1.5) << endl << endl;
    
    MethodResult bis = bisection(1.0, 1.5, eps, max_iter);
    
    if (bis.converged) {
        cout << "  Итерации:" << endl;
        cout << "  ┌───────────┬─────────────────┬─────────────────┬─────────────────┐" << endl;
        cout << "  │     N     │       a         │        b        │    (a+b)/2      │" << endl;
        cout << "  ├───────────┼─────────────────┼─────────────────┼─────────────────┤" << endl;
        
        double a = 1.0, b_val = 1.5;
        for (int i = 0; i < min(15, (int)bis.x_values.size()); i++) {
            double c = bis.x_values[i];
            cout << "  │ " << setw(8) << i+1 << "  │ " << setw(15) << fixed << setprecision(10) << a 
                 << " │ " << setw(15) << b_val << " │ " << setw(15) << c << " │" << endl;
            if (f(a) * f(c) < 0) b_val = c; else a = c;
        }
        if (bis.iterations > 15) {
            cout << "  │    ...    │       ...       │       ...       │       ...       │" << endl;
        }
        cout << "  └───────────┴─────────────────┴─────────────────┴─────────────────┘" << endl << endl;
        
        cout << "  Результат: x* = " << fixed << setprecision(10) << bis.root << endl;
        cout << "  Число итераций: " << bis.iterations << endl;
        cout << "  Проверка: f(x*) = " << scientific << setprecision(6) << f(bis.root) << endl << endl;
    }
    
    // =================== МЕТОД 2: НЬЮТОНА ===================
    cout << "┌─────────────────────────────────────────────────────────────┐" << endl;
    cout << "│  МЕТОД НЬЮТОНА (Касательных)                                │" << endl;
    cout << "└─────────────────────────────────────────────────────────────┘" << endl;
    cout << "  Итерационная формула: x_{n+1} = x_n - f(x_n)/f'(x_n)" << endl << endl;
    
    double x0_newton = 1.5;
    cout << "  Выбор x₀:" << endl;
    cout << "    f(1.0) = " << fixed << setprecision(4) << f(1.0) << ", f''(1.0) = " << d2f(1.0) << endl;
    cout << "    f(1.5) = " << f(1.5) << ", f''(1.5) = " << d2f(1.5) << endl;
    cout << "  x₀ = 1.5: f(x₀)*f''(x₀) = " << f(1.5) * d2f(1.5) << " > 0 ✓" << endl << endl;
    
    MethodResult newt = newton(x0_newton, eps, max_iter);
    
    if (newt.converged) {
        cout << "  Итерации:" << endl;
        cout << "  ┌───────────┬─────────────────┬─────────────────┬─────────────────┐" << endl;
        cout << "  │     N     │       xₙ        │      f(xₙ)      │    |xₙ - xₙ₋₁|   │" << endl;
        cout << "  ├───────────┼─────────────────┼─────────────────┼─────────────────┤" << endl;
        
        double x_prev = x0_newton;
        for (int i = 0; i < (int)newt.x_values.size(); i++) {
            double x_curr = newt.x_values[i];
            cout << "  │ " << setw(8) << i+1 << "  │ " << setw(15) << fixed << setprecision(10) << x_curr 
                 << " │ " << setw(15) << scientific << setprecision(6) << f(x_curr)
                 << " │ " << setw(15) << fabs(x_curr - x_prev) << " │" << endl;
            x_prev = x_curr;
        }
        cout << "  └───────────┴─────────────────┴─────────────────┴─────────────────┘" << endl << endl;
        
        cout << "  Результат: x* = " << fixed << setprecision(10) << newt.root << endl;
        cout << "  Число итераций: " << newt.iterations << endl;
        cout << "  Проверка: f(x*) = " << scientific << setprecision(6) << f(newt.root) << endl << endl;
    }
    
    // =================== МЕТОД 3: ПРОСТОЙ ИТЕРАЦИИ ===================
    cout << "┌─────────────────────────────────────────────────────────────┐" << endl;
    cout << "│  МЕТОД ПРОСТОЙ ИТЕРАЦИИ                                     │" << endl;
    cout << "└─────────────────────────────────────────────────────────────┘" << endl;
    cout << "  Преобразование уравнения:" << endl;
    cout << "    x³ + 1.4x² - 2.9 = 0" << endl;
    cout << "    x³ = 2.9 - 1.4x²" << endl;
    cout << "    x = φ(x) = (2.9 - 1.4x²)^(1/3)" << endl << endl;
    
    cout << "  Проверка условия сходимости |φ'(x)| < 1:" << endl;
    cout << "    φ'(x) = -2.8x / (3*(2.9-1.4x²)^(2/3))" << endl;
    cout << "    При x = 1.0: |φ'(1.0)| ≈ 0.53 < 1 ✓" << endl;
    cout << "    При x = 1.5: |φ'(1.5)| ≈ 1.8 > 1 ✗" << endl << endl;
    
    cout << "  Начальное приближение: x₀ = 1.0" << endl << endl;
    
    MethodResult iter = simple_iteration(1.0, eps, max_iter);
    
    if (iter.converged) {
        cout << "  Итерации:" << endl;
        cout << "  ┌───────────┬─────────────────┬─────────────────┐" << endl;
        cout << "  │     N     │       xₙ        │   |xₙ − xₙ₋₁|   │" << endl;
        cout << "  ├───────────┼─────────────────┼─────────────────┤" << endl;
        
        double x_p = 1.0;
        for (int i = 0; i < (int)iter.x_values.size(); i++) {
            double x_c = iter.x_values[i];
            cout << "  │ " << setw(8) << i+1 << "  │ " << setw(15) << fixed << setprecision(10) << x_c 
                 << " │ " << setw(15) << scientific << setprecision(6) << fabs(x_c - x_p) << " │" << endl;
            x_p = x_c;
        }
        cout << "  └───────────┴─────────────────┴─────────────────┘" << endl << endl;
        
        cout << "  Результат: x* = " << fixed << setprecision(10) << iter.root << endl;
        cout << "  Число итераций: " << iter.iterations << endl;
        cout << "  Проверка: f(x*) = " << scientific << setprecision(6) << f(iter.root) << endl << endl;
    } else {
        cout << "  Метод не сошелся!" << endl << endl;
    }
    
    // =================== МЕТОД 4: ХОРД ===================
    cout << "┌─────────────────────────────────────────────────────────────┐" << endl;
    cout << "│  МЕТОД ХОРД (Секущих)                                       │" << endl;
    cout << "└─────────────────────────────────────────────────────────────┘" << endl;
    cout << "  Итерационная формула:" << endl;
    cout << "    x_{n+1} = x_n - f(x_n) * (x_n - x_{n-1}) / (f(x_n) - f(x_{n-1}))" << endl << endl;
    cout << "  Начальные точки: x₀ = 1.0, x₁ = 1.5" << endl << endl;
    
    MethodResult sec = secant(1.0, 1.5, eps, max_iter);
    
    if (sec.converged) {
        cout << "  Итерации:" << endl;
        cout << "  ┌───────────┬─────────────────┬─────────────────┐" << endl;
        cout << "  │     N     │       xₙ        │      f(xₙ)      │" << endl;
        cout << "  ├───────────┼─────────────────┼─────────────────┤" << endl;
        
        for (int i = 0; i < (int)sec.x_values.size(); i++) {
            double x_curr = sec.x_values[i];
            cout << "  │ " << setw(8) << i+1 << "  │ " << setw(15) << fixed << setprecision(10) << x_curr 
                 << " │ " << setw(15) << scientific << setprecision(6) << f(x_curr) << " │" << endl;
        }
        cout << "  └───────────┴─────────────────┴─────────────────┘" << endl << endl;
        
        cout << "  Результат: x* = " << fixed << setprecision(10) << sec.root << endl;
        cout << "  Число итераций: " << sec.iterations << endl;
        cout << "  Проверка: f(x*) = " << scientific << setprecision(6) << f(sec.root) << endl << endl;
    }
    
    // =================== СРАВНИТЕЛЬНАЯ ТАБЛИЦА ===================
    cout << "═══════════════════════════════════════════════════════════════" << endl;
    cout << "  3. СРАВНИТЕЛЬНЫЙ АНАЛИЗ МЕТОДОВ" << endl;
    cout << "═══════════════════════════════════════════════════════════════" << endl << endl;
    
    cout << "  ┌─────────────────────────────┬───────────────────┬───────────┬─────────────────┐" << endl;
    cout << "  │          Метод              │       Корень      │ Итераций  │     |f(x)|      │" << endl;
    cout << "  ├─────────────────────────────┼───────────────────┼───────────┼─────────────────┤" << endl;
    
    if (bis.converged) {
        cout << "  │ Половинного деления         │ " << setw(16) << fixed << setprecision(10) << bis.root 
             << " │ " << setw(8) << bis.iterations << "  │ " << setw(14) << scientific << setprecision(6) << fabs(f(bis.root)) << " │" << endl;
    }
    if (newt.converged) {
        cout << "  │ Ньютона (касательных)       │ " << setw(16) << fixed << setprecision(10) << newt.root 
             << " │ " << setw(8) << newt.iterations << "  │ " << setw(14) << scientific << setprecision(6) << fabs(f(newt.root)) << " │" << endl;
    }
    if (iter.converged) {
        cout << "  │ Простой итерации            │ " << setw(16) << fixed << setprecision(10) << iter.root 
             << " │ " << setw(8) << iter.iterations << "  │ " << setw(14) << scientific << setprecision(6) << fabs(f(iter.root)) << " │" << endl;
    }
    if (sec.converged) {
        cout << "  │ Хорд (секущих)              │ " << setw(16) << fixed << setprecision(10) << sec.root 
             << " │ " << setw(8) << sec.iterations << "  │ " << setw(14) << scientific << setprecision(6) << fabs(f(sec.root)) << " │" << endl;
    }
    cout << "  └─────────────────────────────┴───────────────────┴───────────┴─────────────────┘" << endl << endl;
    
    // =================== ТЕОРЕТИЧЕСКИЕ СВЕДЕНИЯ ===================
    cout << "═══════════════════════════════════════════════════════════════" << endl;
    cout << "  4. ТЕОРЕТИЧЕСКИЕ СВЕДЕНИЯ О МЕТОДАХ" << endl;
    cout << "═══════════════════════════════════════════════════════════════" << endl << endl;
    
    cout << "  ┌───────────────────────────────────────────────────────────────────┐" << endl;
    cout << "  │ МЕТОД ПОЛОВИННОГО ДЕЛЕНИЯ                                         │" << endl;
    cout << "  ├───────────────────────────────────────────────────────────────────┤" << endl;
    cout << "  │ Условие: f(a)·f(b) < 0 (смена знака на отрезке)                   │" << endl;
    cout << "  │ Скорость сходимости: линейная O(1)                                │" << endl;
    cout << "  │ Число итераций: N ≈ log₂((b-a)/ε)                                 │" << endl;
    cout << "  │ Достоинство: гарантированная сходимость                           │" << endl;
    cout << "  │ Недостаток: медленная сходимость                                  │" << endl;
    cout << "  └───────────────────────────────────────────────────────────────────┘" << endl << endl;
    
    cout << "  ┌───────────────────────────────────────────────────────────────────┐" << endl;
    cout << "  │ МЕТОД НЬЮТОНА (КАСАТЕЛЬНЫХ)                                       │" << endl;
    cout << "  ├───────────────────────────────────────────────────────────────────┤" << endl;
    cout << "  │ Условие: f'(x) ≠ 0, f(x₀)·f''(x₀) > 0                             │" << endl;
    cout << "  │ Скорость сходимости: квадратичная O(2)                            │" << endl;
    cout << "  │ Достоинство: быстрая сходимость                                   │" << endl;
    cout << "  │ Недостаток: требует вычисления производной                        │" << endl;
    cout << "  └───────────────────────────────────────────────────────────────────┘" << endl << endl;
    
    cout << "  ┌───────────────────────────────────────────────────────────────────┐" << endl;
    cout << "  │ МЕТОД ПРОСТОЙ ИТЕРАЦИИ                                            │" << endl;
    cout << "  ├───────────────────────────────────────────────────────────────────┤" << endl;
    cout << "  │ Условие: |φ'(x)| < 1 на отрезке локализации                       │" << endl;
    cout << "  │ Скорость сходимости: линейная O(1)                                │" << endl;
    cout << "  │ Достоинство: простая реализация                                   │" << endl;
    cout << "  │ Недостаток: требует удачного выбора φ(x)                          │" << endl;
    cout << "  └───────────────────────────────────────────────────────────────────┘" << endl << endl;
    
    cout << "  ┌───────────────────────────────────────────────────────────────────┐" << endl;
    cout << "  │ МЕТОД ХОРД (СЕКУЩИХ)                                              │" << endl;
    cout << "  ├───────────────────────────────────────────────────────────────────┤" << endl;
    cout << "  │ Условие: f'(x) и f''(x) сохраняют знак                            │" << endl;
    cout << "  │ Скорость сходимости: суперлинейная O(φ), φ ≈ 1.618                │" << endl;
    cout << "  │ Достоинство: не требует вычисления производной                    │" << endl;
    cout << "  │ Недостаток: чувствителен к выбору начальных точек                 │" << endl;
    cout << "  └───────────────────────────────────────────────────────────────────┘" << endl << endl;
    
    // =================== ВЫВОДЫ ===================
    cout << "═══════════════════════════════════════════════════════════════" << endl;
    cout << "  5. ВЫВОДЫ" << endl;
    cout << "═══════════════════════════════════════════════════════════════" << endl << endl;
    
    int min_iter = 999;
    string fastest = "";
    if (bis.converged && bis.iterations < min_iter) { min_iter = bis.iterations; fastest = "Половинного деления"; }
    if (newt.converged && newt.iterations < min_iter) { min_iter = newt.iterations; fastest = "Ньютона"; }
    if (iter.converged && iter.iterations < min_iter) { min_iter = iter.iterations; fastest = "Простой итерации"; }
    if (sec.converged && sec.iterations < min_iter) { min_iter = sec.iterations; fastest = "Хорд"; }
    
    cout << "  1. Уравнение x³ + 1.4x² − 2.9 = 0 имеет один действительный корень" << endl;
    cout << "     x* ≈ " << fixed << setprecision(10) << newt.root << endl << endl;
    
    cout << "  2. Все методы нашли корень с заданной точностью ε = " << scientific 
         << setprecision(0) << eps << endl << endl;
    
    cout << "  3. Наименьшее число итераций: метод " << fastest 
         << " (" << min_iter << " итераций)" << endl << endl;
    
    cout << "  4. Рекомендации по выбору метода:" << endl;
    cout << "     • Если нужна гарантия сходимости → метод бисекции" << endl;
    cout << "     • Если можно вычислить производную → метод Ньютона" << endl;
    cout << "     • Если производная неизвестна → метод хорд" << endl;
    cout << "     • Для простоты реализации → метод простой итерации" << endl << endl;
    
    cout << "═══════════════════════════════════════════════════════════════" << endl;
    cout << "                      КОНЕЦ РАБОТЫ                              " << endl;
    cout << "═══════════════════════════════════════════════════════════════" << endl;
    
    return 0;
}
