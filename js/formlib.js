/**
 * FormLib - 美化表单元素库
 * 版本: 1.0.0
 * 作者: FormLib Team
 * 许可证: MIT
 */

// 全局FormLib对象
window.FormLib = window.FormLib || {};

/**
 * 输入框验证工具
 */
FormLib.InputValidator = {
    /**
     * 验证必填项
     * @param {string} value - 输入值
     * @returns {boolean} - 是否有效
     */
    required: function(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    },
    
    /**
     * 验证邮箱格式
     * @param {string} value - 输入值
     * @returns {boolean} - 是否有效
     */
    email: function(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },
    
    /**
     * 验证URL格式
     * @param {string} value - 输入值
     * @returns {boolean} - 是否有效
     */
    url: function(value) {
        try {
            new URL(value);
            return true;
        } catch (e) {
            return false;
        }
    },
    
    /**
     * 验证数字范围
     * @param {number} value - 输入值
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @returns {boolean} - 是否有效
     */
    range: function(value, min, max) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    },
    
    /**
     * 验证字符串长度
     * @param {string} value - 输入值
     * @param {number} min - 最小长度
     * @param {number} max - 最大长度
     * @returns {boolean} - 是否有效
     */
    length: function(value, min, max) {
        const len = value.toString().length;
        return len >= min && len <= max;
    },
    
    /**
     * 验证正则表达式
     * @param {string} value - 输入值
     * @param {RegExp} regex - 正则表达式
     * @returns {boolean} - 是否有效
     */
    pattern: function(value, regex) {
        return regex.test(value);
    }
};

/**
 * 对话框管理器
 */
FormLib.Dialog = {
    /**
     * 显示确认对话框
     * @param {Object} options - 对话框选项
     * @param {string} options.title - 对话框标题
     * @param {string} options.message - 对话框消息
     * @param {string} options.confirmText - 确认按钮文本
     * @param {string} options.cancelText - 取消按钮文本
     * @param {Function} options.onConfirm - 确认回调函数
     * @param {Function} options.onCancel - 取消回调函数
     * @returns {Object} - 对话框实例
     */
    confirm: function(options) {
        const defaults = {
            title: '确认操作',
            message: '您确定要执行此操作吗？',
            confirmText: '确定',
            cancelText: '取消',
            onConfirm: null,
            onCancel: null
        };
        
        const settings = { ...defaults, ...options };
        return this.createModal(settings);
    },
    
    /**
     * 显示提示对话框
     * @param {Object} options - 对话框选项
     * @param {string} options.title - 对话框标题
     * @param {string} options.message - 对话框消息
     * @param {string} options.buttonText - 按钮文本
     * @param {Function} options.onClose - 关闭回调函数
     * @returns {Object} - 对话框实例
     */
    alert: function(options) {
        const defaults = {
            title: '提示',
            message: '',
            buttonText: '确定',
            onClose: null
        };
        
        const settings = { ...defaults, ...options };
        return this.createModal({
            ...settings,
            showCancel: false,
            onConfirm: settings.onClose
        });
    },
    
    /**
     * 创建模态对话框
     * @param {Object} options - 对话框选项
     * @returns {Object} - 对话框实例
     */
    createModal: function(options) {
        const defaults = {
            title: '',
            message: '',
            confirmText: '确定',
            cancelText: '取消',
            showCancel: true,
            onConfirm: null,
            onCancel: null
        };
        
        const settings = { ...defaults, ...options };
        
        // 创建对话框元素
        const backdrop = document.createElement('div');
        backdrop.className = 'formlib-modal-backdrop';
        
        const modal = document.createElement('div');
        modal.className = 'formlib-modal';
        
        const header = document.createElement('div');
        header.className = 'formlib-modal-header';
        header.innerHTML = `<h3 class="formlib-modal-title">${settings.title}</h3>`;
        
        const body = document.createElement('div');
        body.className = 'formlib-modal-body';
        body.innerHTML = `<p>${settings.message}</p>`;
        
        const footer = document.createElement('div');
        footer.className = 'formlib-modal-footer';
        
        // 创建确认按钮
        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'formlib-btn formlib-btn-primary';
        confirmBtn.textContent = settings.confirmText;
        confirmBtn.addEventListener('click', () => {
            if (typeof settings.onConfirm === 'function') {
                settings.onConfirm();
            }
            this.close(backdrop);
        });
        
        footer.appendChild(confirmBtn);
        
        // 创建取消按钮
        if (settings.showCancel) {
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'formlib-btn formlib-btn-secondary';
            cancelBtn.textContent = settings.cancelText;
            cancelBtn.addEventListener('click', () => {
                if (typeof settings.onCancel === 'function') {
                    settings.onCancel();
                }
                this.close(backdrop);
            });
            
            footer.appendChild(cancelBtn);
        }
        
        // 组装对话框
        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);
        backdrop.appendChild(modal);
        
        // 添加到文档
        document.body.appendChild(backdrop);
        
        // 显示对话框
        setTimeout(() => {
            backdrop.classList.add('show');
        }, 10);
        
        // 点击背景关闭
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                this.close(backdrop);
            }
        });
        
        // 按ESC键关闭
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.close(backdrop);
            }
        };
        
        document.addEventListener('keydown', escHandler);
        
        // 返回对话框实例
        return {
            close: () => this.close(backdrop),
            element: backdrop,
            _cleanup: () => {
                document.removeEventListener('keydown', escHandler);
            }
        };
    },
    
    /**
     * 关闭对话框
     * @param {HTMLElement} backdrop - 对话框背景元素
     */
    close: function(backdrop) {
        if (!backdrop || !backdrop.parentNode) return;
        
        backdrop.classList.remove('show');
        
        setTimeout(() => {
            if (backdrop.parentNode) {
                backdrop.parentNode.removeChild(backdrop);
            }
            
            // 清理事件监听器
            const instance = backdrop._instance;
            if (instance && typeof instance._cleanup === 'function') {
                instance._cleanup();
            }
        }, 300);
    }
};

/**
 * 颜色选择器
 */
FormLib.ColorPicker = {
    // 预设颜色
    presetColors: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#F8C471', '#82E0AA', '#F1948A', '#85929E', '#AAB7B8',
        '#2C3E50', '#34495E', '#E74C3C', '#3498DB', '#2ECC71',
        '#F39C12', '#9B59B6', '#1ABC9C', '#E67E22', '#34495E',
        '#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6', '#CED4DA',
        '#ADB5BD', '#6C757D', '#495057', '#343A40', '#000000'
    ],
    
    // 最近使用的颜色
    recentColors: [],
    
    /**
     * 初始化颜色选择器
     * @param {HTMLElement} element - 触发元素
     * @param {Object} options - 选项
     * @param {Function} options.onChange - 颜色改变回调
     * @param {string} options.defaultColor - 默认颜色
     * @param {string} options.mode - 模式 ('simple' 或 'professional')
     * @param {boolean} options.showRecent - 是否显示最近使用的颜色
     * @param {boolean} options.showPalette - 是否显示预设颜色面板
     * @param {boolean} options.showCustom - 是否显示自定义颜色输入
     * @returns {Object} - 颜色选择器实例
     */
    init: function(element, options) {
        const defaults = {
            onChange: null,
            defaultColor: '#3b82f6',
            mode: 'simple', // 'simple' 或 'professional'
            showRecent: true,
            showPalette: true,
            showCustom: true
        };
        
        const settings = { ...defaults, ...options };
        let currentColor = settings.defaultColor;
        
        // 根据模式调整选项
        if (settings.mode === 'professional') {
            settings.showRecent = true;
            settings.showPalette = true;
            settings.showCustom = true;
        } else if (settings.mode === 'simple') {
            settings.showRecent = false;
            settings.showPalette = true;
            settings.showCustom = false;
        }
        
        // 创建颜色选择器容器
        const colorpicker = document.createElement('div');
        colorpicker.className = 'formlib-colorpicker';
        
        // 创建颜色按钮
        const button = document.createElement('div');
        button.className = 'formlib-colorpicker-button';
        button.style.backgroundColor = currentColor;
        
        // 创建颜色面板
        const panel = document.createElement('div');
        panel.className = `formlib-colorpicker-panel formlib-colorpicker-${settings.mode}`;
        
        // 创建面板内容容器
        const panelContent = document.createElement('div');
        panelContent.className = 'formlib-colorpicker-content';
        
        // 添加最近使用的颜色（如果启用）
        if (settings.showRecent && this.recentColors.length > 0) {
            const recentSection = this.createRecentColorsSection();
            panelContent.appendChild(recentSection);
        }
        
        // 添加预设颜色面板（如果启用）
        if (settings.showPalette) {
            const paletteSection = this.createColorPaletteSection(settings, currentColor);
            panelContent.appendChild(paletteSection);
        }
        
        // 添加专业模式控件（如果是专业模式）
        if (settings.mode === 'professional') {
            const professionalSection = this.createProfessionalControls(currentColor);
            panelContent.appendChild(professionalSection);
        }
        
        // 添加自定义颜色输入（如果启用）
        if (settings.showCustom) {
            const customSection = this.createCustomColorSection(currentColor);
            panelContent.appendChild(customSection);
        }
        
        // 添加颜色信息显示
        const infoSection = this.createColorInfoSection(currentColor);
        panelContent.appendChild(infoSection);
        
        // 将内容添加到面板
        panel.appendChild(panelContent);
        
        // 组装颜色选择器
        colorpicker.appendChild(button);
        colorpicker.appendChild(panel);
        
        // 替换原始元素
        if (element.parentNode) {
            element.parentNode.replaceChild(colorpicker, element);
        }
        
        // 切换面板显示
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            colorpicker.classList.toggle('show');
        });
        
        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (!colorpicker.contains(e.target)) {
                colorpicker.classList.remove('show');
            }
        });
        
        // 返回实例
        return {
            element: colorpicker,
            getColor: () => currentColor,
            setColor: (color) => this.selectColor(colorpicker, color, settings.onChange),
            destroy: () => {
                if (colorpicker.parentNode) {
                    colorpicker.parentNode.removeChild(colorpicker);
                }
            }
        };
    },
    
    /**
     * 选择颜色
     * @param {HTMLElement} colorpicker - 颜色选择器元素
     * @param {string} color - 颜色值
     * @param {Function} onChange - 回调函数
     * @param {boolean} isCustom - 是否自定义颜色
     */
    selectColor: function(colorpicker, color, onChange, isCustom = false) {
        if (!this.isValidColor(color)) return;
        
        const button = colorpicker.querySelector('.formlib-colorpicker-button');
        const colorInput = colorpicker.querySelector('.formlib-colorinput');
        const colorPreview = colorpicker.querySelector('.formlib-colorpreview');
        const colorItems = colorpicker.querySelectorAll('.formlib-coloritem');
        
        // 更新当前颜色
        button.style.backgroundColor = color;
        if (colorPreview) {
            colorPreview.style.backgroundColor = color;
        }
        
        if (colorInput) {
            colorInput.value = color;
        }
        
        // 更新选中状态
        colorItems.forEach(item => {
            item.classList.toggle('active', item.dataset.color === color);
        });
        
        // 更新滑块值（专业模式）
        const sliders = colorpicker.querySelectorAll('.formlib-colorpicker-slider');
        if (sliders.length === 3) {
            const hsl = this.hexToHsl(color);
            sliders[0].value = hsl[0];
            sliders[1].value = hsl[1];
            sliders[2].value = hsl[2];
            
            // 更新滑块值显示
            const values = colorpicker.querySelectorAll('.formlib-colorpicker-slider-value');
            if (values.length === 3) {
                values[0].textContent = Math.round(hsl[0]);
                values[1].textContent = Math.round(hsl[1]);
                values[2].textContent = Math.round(hsl[2]);
            }
        }
        
        // 更新颜色信息（专业模式）
        const infoItems = colorpicker.querySelectorAll('.formlib-colorpicker-info-item');
        if (infoItems.length >= 3) {
            // HEX值
            const hexValue = infoItems[0].querySelector('.formlib-colorpicker-info-value');
            if (hexValue) {
                hexValue.textContent = color.toUpperCase();
                hexValue.setAttribute('data-copy', color.toUpperCase());
            }
            
            // RGB值
            const rgb = this.hexToRgb(color);
            const rgbValue = infoItems[1].querySelector('.formlib-colorpicker-info-value');
            if (rgbValue) {
                const rgbText = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
                rgbValue.textContent = rgbText;
                rgbValue.setAttribute('data-copy', rgbText);
            }
            
            // HSL值
            const hsl = this.hexToHsl(color);
            const hslValue = infoItems[2].querySelector('.formlib-colorpicker-info-value');
            if (hslValue) {
                const hslText = `${Math.round(hsl[0])}, ${Math.round(hsl[1])}%, ${Math.round(hsl[2])}%`;
                hslValue.textContent = hslText;
                hslValue.setAttribute('data-copy', hslText);
            }
        }
        
        // 更新色轮标记位置（专业模式）
        const wheelCanvas = colorpicker.querySelector('.formlib-colorpicker-wheel-canvas');
        if (wheelCanvas) {
            this.drawColorWheel(wheelCanvas, color);
        }
        
        // 更新色盘标记位置（专业模式）
        const plateCanvas = colorpicker.querySelector('.formlib-colorpicker-plate-canvas');
        if (plateCanvas) {
            this.drawColorPlate(plateCanvas, color);
        }
        
        // 添加到最近使用的颜色
        this.addRecentColor(color);
        
        // 如果是专业模式，更新最近使用的颜色区域
        if (colorpicker.classList.contains('formlib-colorpicker-professional')) {
            const recentSection = colorpicker.querySelector('.formlib-colorpicker-section:first-child');
            if (recentSection && recentSection.querySelector('.formlib-colorgrid-recent')) {
                // 重新创建最近使用的颜色区域
                const newRecentSection = this.createRecentColorsSection();
                recentSection.parentNode.replaceChild(newRecentSection, recentSection);
            }
        }
        
        // 触发回调
        if (typeof onChange === 'function') {
            onChange(color, isCustom);
        }
    },
    
    /**
     * 验证颜色值是否有效
     * @param {string} color - 颜色值
     * @returns {boolean} - 是否有效
     */
    isValidColor: function(color) {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    },
    
    /**
     * 创建最近使用的颜色区域
     * @returns {HTMLElement} - 最近使用的颜色区域元素
     */
    createRecentColorsSection: function() {
        const section = document.createElement('div');
        section.className = 'formlib-colorpicker-section';
        
        const title = document.createElement('div');
        title.className = 'formlib-colorpicker-section-title';
        title.textContent = '最近使用';
        
        const colorgrid = document.createElement('div');
        colorgrid.className = 'formlib-colorgrid formlib-colorgrid-recent';
        
        this.recentColors.forEach(color => {
            const colorItem = document.createElement('div');
            colorItem.className = 'formlib-coloritem';
            colorItem.style.backgroundColor = color;
            colorItem.dataset.color = color;
            
            colorItem.addEventListener('click', (e) => {
                const colorpicker = e.target.closest('.formlib-colorpicker');
                if (colorpicker && colorpicker._instance) {
                    this.selectColor(colorpicker, color, colorpicker._instance._settings.onChange);
                }
            });
            
            colorgrid.appendChild(colorItem);
        });
        
        section.appendChild(title);
        section.appendChild(colorgrid);
        
        return section;
    },
    
    /**
     * 创建颜色调色板区域
     * @param {Object} settings - 设置
     * @param {string} currentColor - 当前颜色
     * @returns {HTMLElement} - 颜色调色板区域元素
     */
    createColorPaletteSection: function(settings, currentColor) {
        const section = document.createElement('div');
        section.className = 'formlib-colorpicker-section';
        
        const title = document.createElement('div');
        title.className = 'formlib-colorpicker-section-title';
        title.textContent = '预设颜色';
        
        const colorgrid = document.createElement('div');
        colorgrid.className = 'formlib-colorgrid';
        
        this.presetColors.forEach(color => {
            const colorItem = document.createElement('div');
            colorItem.className = 'formlib-coloritem';
            colorItem.style.backgroundColor = color;
            colorItem.dataset.color = color;
            
            if (color === currentColor) {
                colorItem.classList.add('active');
            }
            
            colorItem.addEventListener('click', (e) => {
                const colorpicker = e.target.closest('.formlib-colorpicker');
                if (colorpicker && colorpicker._instance) {
                    this.selectColor(colorpicker, color, colorpicker._instance._settings.onChange);
                }
            });
            
            colorgrid.appendChild(colorItem);
        });
        
        section.appendChild(title);
        section.appendChild(colorgrid);
        
        return section;
    },
    
    /**
     * 创建专业模式控件
     * @param {string} currentColor - 当前颜色
     * @returns {HTMLElement} - 专业模式控件区域元素
     */
    createProfessionalControls: function(currentColor) {
        const section = document.createElement('div');
        section.className = 'formlib-colorpicker-section';
        
        const title = document.createElement('div');
        title.className = 'formlib-colorpicker-section-title';
        title.textContent = '颜色选择';
        
        // 创建色轮和色盘容器
        const colorWheelContainer = document.createElement('div');
        colorWheelContainer.className = 'formlib-colorpicker-wheel-container';
        
        // 创建色轮
        const colorWheel = this.createColorWheel(currentColor);
        colorWheelContainer.appendChild(colorWheel);
        
        // 创建色盘
        const colorPlate = this.createColorPlate(currentColor);
        colorWheelContainer.appendChild(colorPlate);
        
        section.appendChild(title);
        section.appendChild(colorWheelContainer);
        
        // 添加HSL滑块区域
        const hslSection = document.createElement('div');
        hslSection.className = 'formlib-colorpicker-section';
        
        const hslTitle = document.createElement('div');
        hslTitle.className = 'formlib-colorpicker-section-title';
        hslTitle.textContent = '精确调整';
        
        // 创建HSL调整控件
        const hslControls = document.createElement('div');
        hslControls.className = 'formlib-colorpicker-hsl-controls';
        
        // 色调滑块
        const hueSlider = this.createSliderControl('H', 0, 360, this.hexToHsl(currentColor)[0]);
        // 饱和度滑块
        const saturationSlider = this.createSliderControl('S', 0, 100, this.hexToHsl(currentColor)[1]);
        // 亮度滑块
        const lightnessSlider = this.createSliderControl('L', 0, 100, this.hexToHsl(currentColor)[2]);
        
        hslControls.appendChild(hueSlider);
        hslControls.appendChild(saturationSlider);
        hslControls.appendChild(lightnessSlider);
        
        hslSection.appendChild(hslTitle);
        hslSection.appendChild(hslControls);
        
        // 将HSL滑块区域添加到主区域后面
        section.appendChild(hslSection);
        
        return section;
    },
    
    /**
     * 创建色轮
     * @param {string} currentColor - 当前颜色
     * @returns {HTMLElement} - 色轮元素
     */
    createColorWheel: function(currentColor) {
        const wheelContainer = document.createElement('div');
        wheelContainer.className = 'formlib-colorpicker-wheel';
        
        const canvas = document.createElement('canvas');
        canvas.className = 'formlib-colorpicker-wheel-canvas';
        canvas.width = 200;
        canvas.height = 200;
        
        const wheelMarker = document.createElement('div');
        wheelMarker.className = 'formlib-colorpicker-wheel-marker';
        
        wheelContainer.appendChild(canvas);
        wheelContainer.appendChild(wheelMarker);
        
        // 绘制色轮
        this.drawColorWheel(canvas, currentColor);
        
        // 添加交互事件
        this.addColorWheelEvents(canvas, wheelMarker);
        
        return wheelContainer;
    },
    
    /**
     * 绘制色轮
     * @param {HTMLCanvasElement} canvas - Canvas元素
     * @param {string} currentColor - 当前颜色
     */
    drawColorWheel: function(canvas, currentColor) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 5;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制色轮
        for (let angle = 0; angle < 360; angle++) {
            const startAngle = (angle - 1) * Math.PI / 180;
            const endAngle = (angle + 1) * Math.PI / 180;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            const hue = angle;
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.fill();
        }
        
        // 绘制白色中心圆
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.2, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        // 绘制黑色外圈
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 设置当前颜色的标记位置
        const hsl = this.hexToHsl(currentColor);
        const angle = hsl[0] * Math.PI / 180;
        const distance = radius * (hsl[1] / 100);
        
        const markerX = centerX + Math.cos(angle - Math.PI/2) * distance;
        const markerY = centerY + Math.sin(angle - Math.PI/2) * distance;
        
        const marker = canvas.nextElementSibling;
        marker.style.left = `${markerX - 6}px`;
        marker.style.top = `${markerY - 6}px`;
    },
    
    /**
     * 添加色轮交互事件
     * @param {HTMLCanvasElement} canvas - Canvas元素
     * @param {HTMLElement} marker - 标记元素
     */
    addColorWheelEvents: function(canvas, marker) {
        let isDragging = false;
        
        const updateMarker = (e) => {
            const rect = canvas.getBoundingClientRect();
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(centerX, centerY) - 5;
            
            const x = e.clientX - rect.left - centerX;
            const y = e.clientY - rect.top - centerY;
            
            let angle = Math.atan2(y, x) + Math.PI/2;
            if (angle < 0) angle += 2 * Math.PI;
            const hue = angle * 180 / Math.PI;
            
            const distance = Math.sqrt(x*x + y*y);
            const saturation = Math.min(distance / radius, 1) * 100;
            
            // 限制在色轮范围内
            const limitedDistance = Math.min(distance, radius);
            const markerX = centerX + Math.cos(angle - Math.PI/2) * limitedDistance;
            const markerY = centerY + Math.sin(angle - Math.PI/2) * limitedDistance;
            
            marker.style.left = `${markerX - 6}px`;
            marker.style.top = `${markerY - 6}px`;
            
            // 获取当前亮度
            const colorpicker = canvas.closest('.formlib-colorpicker');
            if (colorpicker && colorpicker._instance) {
                const currentColor = colorpicker._instance.getColor();
                const hsl = this.hexToHsl(currentColor);
                const newColor = this.hslToHex(hue, saturation, hsl[2]);
                
                this.selectColor(colorpicker, newColor, colorpicker._instance._settings.onChange, true);
            }
        };
        
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateMarker(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                updateMarker(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        canvas.addEventListener('click', updateMarker);
    },
    
    /**
     * 创建色盘
     * @param {string} currentColor - 当前颜色
     * @returns {HTMLElement} - 色盘元素
     */
    createColorPlate: function(currentColor) {
        const plateContainer = document.createElement('div');
        plateContainer.className = 'formlib-colorpicker-plate';
        
        const canvas = document.createElement('canvas');
        canvas.className = 'formlib-colorpicker-plate-canvas';
        canvas.width = 150;
        canvas.height = 150;
        
        const plateMarker = document.createElement('div');
        plateMarker.className = 'formlib-colorpicker-plate-marker';
        
        plateContainer.appendChild(canvas);
        plateContainer.appendChild(plateMarker);
        
        // 绘制色盘
        this.drawColorPlate(canvas, currentColor);
        
        // 添加交互事件
        this.addColorPlateEvents(canvas, plateMarker);
        
        return plateContainer;
    },
    
    /**
     * 绘制色盘
     * @param {HTMLCanvasElement} canvas - Canvas元素
     * @param {string} currentColor - 当前颜色
     */
    drawColorPlate: function(canvas, currentColor) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 获取当前HSL值
        const hsl = this.hexToHsl(currentColor);
        const hue = hsl[0];
        
        // 绘制饱和度渐变
        const saturationGradient = ctx.createLinearGradient(0, 0, width, 0);
        saturationGradient.addColorStop(0, `hsl(${hue}, 0%, 50%)`);
        saturationGradient.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
        
        ctx.fillStyle = saturationGradient;
        ctx.fillRect(0, 0, width, height);
        
        // 绘制亮度渐变
        const lightnessGradient = ctx.createLinearGradient(0, 0, 0, height);
        lightnessGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        lightnessGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        lightnessGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        
        ctx.fillStyle = lightnessGradient;
        ctx.fillRect(0, 0, width, height);
        
        // 绘制边框
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, width, height);
        
        // 设置当前颜色的标记位置
        const saturation = hsl[1] / 100;
        const lightness = 1 - (hsl[2] / 100);
        
        const markerX = saturation * width;
        const markerY = lightness * height;
        
        const marker = canvas.nextElementSibling;
        marker.style.left = `${markerX - 5}px`;
        marker.style.top = `${markerY - 5}px`;
    },
    
    /**
     * 添加色盘交互事件
     * @param {HTMLCanvasElement} canvas - Canvas元素
     * @param {HTMLElement} marker - 标记元素
     */
    addColorPlateEvents: function(canvas, marker) {
        let isDragging = false;
        
        const updateMarker = (e) => {
            const rect = canvas.getBoundingClientRect();
            const width = canvas.width;
            const height = canvas.height;
            
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            
            // 限制在色盘范围内
            x = Math.max(0, Math.min(x, width));
            y = Math.max(0, Math.min(y, height));
            
            const saturation = (x / width) * 100;
            const lightness = 100 - (y / height) * 100;
            
            marker.style.left = `${x - 5}px`;
            marker.style.top = `${y - 5}px`;
            
            // 获取当前色调
            const colorpicker = canvas.closest('.formlib-colorpicker');
            if (colorpicker && colorpicker._instance) {
                const currentColor = colorpicker._instance.getColor();
                const hsl = this.hexToHsl(currentColor);
                const newColor = this.hslToHex(hsl[0], saturation, lightness);
                
                this.selectColor(colorpicker, newColor, colorpicker._instance._settings.onChange, true);
            }
        };
        
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateMarker(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                updateMarker(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        canvas.addEventListener('click', updateMarker);
    },
    
    /**
     * 创建滑块控件
     * @param {string} label - 标签
     * @param {number} min - 最小值
     * @param {number} max - 最大值
     * @param {number} value - 当前值
     * @returns {HTMLElement} - 滑块控件元素
     */
    createSliderControl: function(label, min, max, value) {
        const control = document.createElement('div');
        control.className = 'formlib-colorpicker-slider-control';
        
        const labelElement = document.createElement('label');
        labelElement.className = 'formlib-colorpicker-slider-label';
        labelElement.textContent = label;
        
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'formlib-colorpicker-slider-container';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.value = value;
        slider.className = 'formlib-colorpicker-slider';
        
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'formlib-colorpicker-slider-value';
        valueDisplay.textContent = Math.round(value);
        
        slider.addEventListener('input', (e) => {
            valueDisplay.textContent = Math.round(e.target.value);
            
            const colorpicker = e.target.closest('.formlib-colorpicker');
            if (colorpicker && colorpicker._instance) {
                this.updateColorFromSliders(colorpicker);
            }
        });
        
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(valueDisplay);
        
        control.appendChild(labelElement);
        control.appendChild(sliderContainer);
        
        return control;
    },
    
    /**
     * 从滑块更新颜色
     * @param {HTMLElement} colorpicker - 颜色选择器元素
     */
    updateColorFromSliders: function(colorpicker) {
        const sliders = colorpicker.querySelectorAll('.formlib-colorpicker-slider');
        if (sliders.length !== 3) return;
        
        const h = parseFloat(sliders[0].value);
        const s = parseFloat(sliders[1].value);
        const l = parseFloat(sliders[2].value);
        
        const color = this.hslToHex(h, s, l);
        
        if (colorpicker._instance) {
            this.selectColor(colorpicker, color, colorpicker._instance._settings.onChange, true);
        }
    },
    
    /**
     * 创建自定义颜色区域
     * @param {string} currentColor - 当前颜色
     * @returns {HTMLElement} - 自定义颜色区域元素
     */
    createCustomColorSection: function(currentColor) {
        const section = document.createElement('div');
        section.className = 'formlib-colorpicker-section';
        
        const title = document.createElement('div');
        title.className = 'formlib-colorpicker-section-title';
        title.textContent = '自定义颜色';
        
        const customColor = document.createElement('div');
        customColor.className = 'formlib-colorcustom';
        
        const colorInput = document.createElement('input');
        colorInput.type = 'text';
        colorInput.className = 'formlib-colorinput';
        colorInput.value = currentColor;
        colorInput.placeholder = '#000000';
        
        const colorPreview = document.createElement('div');
        colorPreview.className = 'formlib-colorpreview';
        colorPreview.style.backgroundColor = currentColor;
        
        colorInput.addEventListener('input', (e) => {
            const color = e.target.value;
            if (this.isValidColor(color)) {
                colorPreview.style.backgroundColor = color;
                
                const colorpicker = e.target.closest('.formlib-colorpicker');
                if (colorpicker && colorpicker._instance) {
                    this.selectColor(colorpicker, color, colorpicker._instance._settings.onChange, true);
                }
            }
        });
        
        customColor.appendChild(colorInput);
        customColor.appendChild(colorPreview);
        
        section.appendChild(title);
        section.appendChild(customColor);
        
        return section;
    },
    
    /**
     * 创建颜色信息区域
     * @param {string} currentColor - 当前颜色
     * @returns {HTMLElement} - 颜色信息区域元素
     */
    createColorInfoSection: function(currentColor) {
        const section = document.createElement('div');
        section.className = 'formlib-colorpicker-section';
        
        const title = document.createElement('div');
        title.className = 'formlib-colorpicker-section-title';
        title.textContent = '颜色信息';
        
        const infoGrid = document.createElement('div');
        infoGrid.className = 'formlib-colorpicker-info-grid';
        
        // HEX值
        const hexInfo = this.createColorInfoItem('HEX', currentColor.toUpperCase());
        // RGB值
        const rgb = this.hexToRgb(currentColor);
        const rgbInfo = this.createColorInfoItem('RGB', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
        // HSL值
        const hsl = this.hexToHsl(currentColor);
        const hslInfo = this.createColorInfoItem('HSL', `${Math.round(hsl[0])}, ${Math.round(hsl[1])}%, ${Math.round(hsl[2])}%`);
        
        infoGrid.appendChild(hexInfo);
        infoGrid.appendChild(rgbInfo);
        infoGrid.appendChild(hslInfo);
        
        section.appendChild(title);
        section.appendChild(infoGrid);
        
        return section;
    },
    
    /**
     * 创建颜色信息项
     * @param {string} label - 标签
     * @param {string} value - 值
     * @returns {HTMLElement} - 颜色信息项元素
     */
    createColorInfoItem: function(label, value) {
        const item = document.createElement('div');
        item.className = 'formlib-colorpicker-info-item';
        
        const labelElement = document.createElement('span');
        labelElement.className = 'formlib-colorpicker-info-label';
        labelElement.textContent = label;
        
        const valueElement = document.createElement('span');
        valueElement.className = 'formlib-colorpicker-info-value';
        valueElement.textContent = value;
        valueElement.setAttribute('data-copy', value);
        
        // 添加复制功能
        valueElement.addEventListener('click', (e) => {
            const textToCopy = e.target.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                // 显示复制成功提示
                const originalText = e.target.textContent;
                e.target.textContent = '已复制!';
                e.target.classList.add('copied');
                
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.classList.remove('copied');
                }, 1000);
            });
        });
        
        item.appendChild(labelElement);
        item.appendChild(valueElement);
        
        return item;
    },
    
    /**
     * 将HEX颜色转换为RGB
     * @param {string} hex - HEX颜色值
     * @returns {Object} - RGB颜色值
     */
    hexToRgb: function(hex) {
        // 移除#号
        hex = hex.replace(/^#/, '');
        
        // 解析HEX值
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16);
            g = parseInt(hex[1] + hex[1], 16);
            b = parseInt(hex[2] + hex[2], 16);
        } else {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        }
        
        return { r, g, b };
    },
    
    /**
     * 将RGB颜色转换为HEX
     * @param {number} r - 红色值
     * @param {number} g - 绿色值
     * @param {number} b - 蓝色值
     * @returns {string} - HEX颜色值
     */
    rgbToHex: function(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },
    
    /**
     * 将HEX颜色转换为HSL
     * @param {string} hex - HEX颜色值
     * @returns {Array} - HSL颜色值
     */
    hexToHsl: function(hex) {
        const rgb = this.hexToRgb(hex);
        return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    },
    
    /**
     * 将RGB颜色转换为HSL
     * @param {number} r - 红色值
     * @param {number} g - 绿色值
     * @param {number} b - 蓝色值
     * @returns {Array} - HSL颜色值
     */
    rgbToHsl: function(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // 灰色
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
        
        return [h * 360, s * 100, l * 100];
    },
    
    /**
     * 将HSL颜色转换为HEX
     * @param {number} h - 色调值
     * @param {number} s - 饱和度值
     * @param {number} l - 亮度值
     * @returns {string} - HEX颜色值
     */
    hslToHex: function(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l; // 灰色
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = x => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    },
    
    /**
     * 添加最近使用的颜色
     * @param {string} color - 颜色值
     */
    addRecentColor: function(color) {
        // 移除已存在的相同颜色
        const index = this.recentColors.indexOf(color);
        if (index > -1) {
            this.recentColors.splice(index, 1);
        }
        
        // 添加到开头
        this.recentColors.unshift(color);
        
        // 限制最近使用的颜色数量
        if (this.recentColors.length > 16) {
            this.recentColors = this.recentColors.slice(0, 16);
        }
        
        // 保存到本地存储
        try {
            localStorage.setItem('formlib-recent-colors', JSON.stringify(this.recentColors));
        } catch (e) {
            console.warn('无法保存最近使用的颜色到本地存储');
        }
    },
    
    /**
     * 加载最近使用的颜色
     */
    loadRecentColors: function() {
        try {
            const saved = localStorage.getItem('formlib-recent-colors');
            if (saved) {
                this.recentColors = JSON.parse(saved);
            }
        } catch (e) {
            console.warn('无法从本地存储加载最近使用的颜色');
        }
    }
};

// 加载最近使用的颜色
FormLib.ColorPicker.loadRecentColors();

/**
 * 主题管理器
 */
FormLib.Theme = {
    /**
     * 设置主题
     * @param {string} theme - 主题名称 ('light' 或 'dark')
     */
    setTheme: function(theme) {
        const body = document.body;
        
        if (theme === 'dark') {
            body.classList.add('formlib-dark');
            localStorage.setItem('formlib-theme', 'dark');
        } else {
            body.classList.remove('formlib-dark');
            localStorage.setItem('formlib-theme', 'light');
        }
    },
    
    /**
     * 获取当前主题
     * @returns {string} - 当前主题名称
     */
    getTheme: function() {
        return document.body.classList.contains('formlib-dark') ? 'dark' : 'light';
    },
    
    /**
     * 切换主题
     * @returns {string} - 切换后的主题名称
     */
    toggleTheme: function() {
        const current = this.getTheme();
        const newTheme = current === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        return newTheme;
    },
    
    /**
     * 初始化主题（从本地存储或系统偏好加载）
     */
    init: function() {
        const savedTheme = localStorage.getItem('formlib-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else if (prefersDark) {
            this.setTheme('dark');
        }
    }
};

/**
 * 表单验证器
 */
FormLib.FormValidator = {
    /**
     * 初始化表单验证
     * @param {HTMLElement} form - 表单元素
     * @param {Object} options - 验证选项
     * @returns {Object} - 验证器实例
     */
    init: function(form, options) {
        const defaults = {
            onSubmit: null,
            onError: null,
            onSuccess: null,
            validateOnBlur: true,
            validateOnChange: false
        };
        
        const settings = { ...defaults, ...options };
        const fields = this.parseFields(form);
        
        // 绑定事件
        if (settings.validateOnBlur) {
            fields.forEach(field => {
                field.element.addEventListener('blur', () => this.validateField(field));
            });
        }
        
        if (settings.validateOnChange) {
            fields.forEach(field => {
                field.element.addEventListener('change', () => this.validateField(field));
            });
        }
        
        // 表单提交
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isValid = this.validateAll(fields);
            
            if (typeof settings.onSubmit === 'function') {
                settings.onSubmit(isValid, form, fields);
            }
            
            if (isValid) {
                if (typeof settings.onSuccess === 'function') {
                    settings.onSuccess(form);
                }
            } else {
                if (typeof settings.onError === 'function') {
                    settings.onError(form, fields);
                }
                
                // 滚动到第一个错误字段
                const firstError = fields.find(field => !field.isValid);
                if (firstError) {
                    firstError.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.element.focus();
                }
            }
        });
        
        return {
            validate: () => this.validateAll(fields),
            reset: () => this.resetForm(fields),
            form: form,
            fields: fields
        };
    },
    
    /**
     * 解析表单字段
     * @param {HTMLElement} form - 表单元素
     * @returns {Array} - 字段数组
     */
    parseFields: function(form) {
        const fields = [];
        const inputs = form.querySelectorAll('.formlib-input');
        
        inputs.forEach(input => {
            const field = {
                element: input,
                name: input.name,
                rules: this.getRules(input),
                isValid: true,
                errors: []
            };
            
            fields.push(field);
        });
        
        return fields;
    },
    
    /**
     * 获取字段验证规则
     * @param {HTMLElement} input - 输入元素
     * @returns {Object} - 验证规则
     */
    getRules: function(input) {
        const rules = {};
        
        // 从data属性获取规则
        if (input.hasAttribute('data-required')) {
            rules.required = true;
        }
        
        if (input.hasAttribute('data-email')) {
            rules.email = true;
        }
        
        if (input.hasAttribute('data-url')) {
            rules.url = true;
        }
        
        if (input.hasAttribute('data-min')) {
            rules.min = parseFloat(input.getAttribute('data-min'));
        }
        
        if (input.hasAttribute('data-max')) {
            rules.max = parseFloat(input.getAttribute('data-max'));
        }
        
        if (input.hasAttribute('data-minlength')) {
            rules.minlength = parseInt(input.getAttribute('data-minlength'));
        }
        
        if (input.hasAttribute('data-maxlength')) {
            rules.maxlength = parseInt(input.getAttribute('data-maxlength'));
        }
        
        if (input.hasAttribute('data-pattern')) {
            rules.pattern = new RegExp(input.getAttribute('data-pattern'));
        }
        
        return rules;
    },
    
    /**
     * 验证单个字段
     * @param {Object} field - 字段对象
     * @returns {boolean} - 是否有效
     */
    validateField: function(field) {
        const value = field.element.value;
        const rules = field.rules;
        const errors = [];
        
        // 验证必填
        if (rules.required && !FormLib.InputValidator.required(value)) {
            errors.push(field.element.getAttribute('data-required-message') || '此字段为必填项');
        }
        
        // 验证邮箱
        if (rules.email && value && !FormLib.InputValidator.email(value)) {
            errors.push(field.element.getAttribute('data-email-message') || '请输入有效的邮箱地址');
        }
        
        // 验证URL
        if (rules.url && value && !FormLib.InputValidator.url(value)) {
            errors.push(field.element.getAttribute('data-url-message') || '请输入有效的URL地址');
        }
        
        // 验证最小值
        if (rules.min !== undefined && value && !FormLib.InputValidator.range(value, rules.min, Infinity)) {
            errors.push(field.element.getAttribute('data-min-message') || `请输入不小于${rules.min}的值`);
        }
        
        // 验证最大值
        if (rules.max !== undefined && value && !FormLib.InputValidator.range(value, -Infinity, rules.max)) {
            errors.push(field.element.getAttribute('data-max-message') || `请输入不大于${rules.max的值}`);
        }
        
        // 验证最小长度
        if (rules.minlength !== undefined && !FormLib.InputValidator.length(value, rules.minlength, Infinity)) {
            errors.push(field.element.getAttribute('data-minlength-message') || `最少需要${rules.minlength}个字符`);
        }
        
        // 验证最大长度
        if (rules.maxlength !== undefined && !FormLib.InputValidator.length(value, -Infinity, rules.maxlength)) {
            errors.push(field.element.getAttribute('data-maxlength-message') || `最多允许${rules.maxlength}个字符`);
        }
        
        // 验证正则表达式
        if (rules.pattern && value && !FormLib.InputValidator.pattern(value, rules.pattern)) {
            errors.push(field.element.getAttribute('data-pattern-message') || '输入格式不正确');
        }
        
        // 更新字段状态
        field.isValid = errors.length === 0;
        field.errors = errors;
        
        // 更新UI
        this.updateFieldUI(field);
        
        return field.isValid;
    },
    
    /**
     * 验证所有字段
     * @param {Array} fields - 字段数组
     * @returns {boolean} - 是否全部有效
     */
    validateAll: function(fields) {
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    },
    
    /**
     * 更新字段UI
     * @param {Object} field - 字段对象
     */
    updateFieldUI: function(field) {
        const input = field.element;
        const parent = input.closest('.formlib-input-group');
        
        // 移除旧的错误信息
        const oldError = parent?.querySelector('.formlib-input-error');
        if (oldError) {
            oldError.remove();
        }
        
        // 更新输入框样式
        input.classList.remove('error', 'success');
        
        if (!field.isValid) {
            input.classList.add('error');
            
            // 显示错误信息
            if (parent && field.errors.length > 0) {
                const errorElement = document.createElement('div');
                errorElement.className = 'formlib-input-error';
                errorElement.textContent = field.errors[0];
                parent.appendChild(errorElement);
            }
        } else if (input.value) {
            input.classList.add('success');
        }
    },
    
    /**
     * 重置表单
     * @param {Array} fields - 字段数组
     */
    resetForm: function(fields) {
        fields.forEach(field => {
            field.element.value = '';
            field.element.classList.remove('error', 'success');
            field.isValid = true;
            field.errors = [];
            
            const parent = field.element.closest('.formlib-input-group');
            const oldError = parent?.querySelector('.formlib-input-error');
            if (oldError) {
                oldError.remove();
            }
        });
    }
};

/**
 * 初始化所有FormLib组件
 */
FormLib.init = function() {
    // 初始化主题
    this.Theme.init();
    
    // 初始化颜色选择器
    document.querySelectorAll('[data-formlib="colorpicker"]').forEach(element => {
        this.ColorPicker.init(element, {
            defaultColor: element.getAttribute('data-default-color'),
            onChange: (color) => {
                const target = element.getAttribute('data-target');
                if (target) {
                    const targetElement = document.querySelector(target);
                    if (targetElement) {
                        targetElement.value = color;
                    }
                }
            }
        });
    });
    
    // 初始化表单验证
    document.querySelectorAll('[data-formlib="form"]').forEach(form => {
        this.FormValidator.init(form, {
            onSuccess: (form) => {
                // 可以在这里处理表单提交成功的逻辑
                console.log('表单验证成功', form);
            },
            onError: (form, fields) => {
                // 可以在这里处理表单验证失败的逻辑
                console.log('表单验证失败', fields);
            }
        });
    });
    
    // 初始化主题切换按钮
    document.querySelectorAll('[data-formlib="theme-toggle"]').forEach(button => {
        button.addEventListener('click', () => {
            const newTheme = this.Theme.toggleTheme();
            button.setAttribute('data-theme', newTheme);
        });
    });
};

// DOM加载完成后自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => FormLib.init());
} else {
    FormLib.init();
}