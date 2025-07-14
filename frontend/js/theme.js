// Sistema de Temas
class ThemeSystem {
    constructor() {
        this.currentTheme = 'azul';
        this.customColor = '#2563EB';
        this.init();
    }

    init() {
        // Carregar configurações salvas
        this.loadSettings();
        // Aplicar tema
        this.applyTheme();
        // Carregar logo personalizado
        this.loadCustomLogo();
    }

    loadSettings() {
        const settings = localStorage.getItem('themeSettings');
        if (settings) {
            const parsed = JSON.parse(settings);
            this.currentTheme = parsed.theme || 'azul';
            this.customColor = parsed.customColor || '#2563EB';
        }
    }

    saveSettings() {
        const settings = {
            theme: this.currentTheme,
            customColor: this.customColor
        };
        localStorage.setItem('themeSettings', JSON.stringify(settings));
    }

    applyTheme() {
        const body = document.body;
        
        // Remover temas anteriores
        body.removeAttribute('data-theme');
        
        if (this.currentTheme !== 'azul') {
            body.setAttribute('data-theme', this.currentTheme);
        }

        // Aplicar cor personalizada se necessário
        if (this.currentTheme === 'personalizado') {
            this.applyCustomColor(this.customColor);
        }
    }

    applyCustomColor(color) {
        const root = document.documentElement;
        
        // Converter hex para RGB para criar variações
        const rgb = this.hexToRgb(color);
        const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        // Criar variações da cor
        const darkColor = this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 0.1, 0));
        const lightColor = this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 0.1, 1));

        root.style.setProperty('--primary-color', color);
        root.style.setProperty('--primary-dark', darkColor);
        root.style.setProperty('--primary-light', lightColor);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme();
        this.saveSettings();
    }

    setCustomColor(color) {
        this.customColor = color;
        this.currentTheme = 'personalizado';
        this.applyTheme();
        this.saveSettings();
    }

    loadCustomLogo() {
        const logoData = localStorage.getItem('customLogo');
        if (logoData) {
            const logos = document.querySelectorAll('#company-logo, #header-logo, #logo-preview');
            logos.forEach(logo => {
                if (logo) logo.src = logoData;
            });
        }
    }

    setCustomLogo(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject('Nenhum arquivo selecionado');
                return;
            }

            if (!file.type.startsWith('image/')) {
                reject('Arquivo deve ser uma imagem');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const logoData = e.target.result;
                localStorage.setItem('customLogo', logoData);
                this.loadCustomLogo();
                resolve(logoData);
            };
            reader.onerror = () => reject('Erro ao ler arquivo');
            reader.readAsDataURL(file);
        });
    }

    // Utilitários de conversão de cores
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h, s, l };
    }

    hslToHex(h, s, l) {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    getAvailableThemes() {
        return [
            { value: 'azul', name: 'Azul (Padrão)', color: '#2563EB' },
            { value: 'verde', name: 'Verde', color: '#059669' },
            { value: 'roxo', name: 'Roxo', color: '#7C3AED' },
            { value: 'cinza', name: 'Cinza', color: '#374151' }
        ];
    }
}

// Instância global do sistema de temas
window.themeSystem = new ThemeSystem();

