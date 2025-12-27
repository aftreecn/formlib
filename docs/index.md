# FormLib 文档

## 目录

- [简介](#简介)
- [安装](#安装)
- [快速开始](#快速开始)
- [组件文档](#组件文档)
  - [输入框](#输入框)
  - [按钮](#按钮)
  - [对话框](#对话框)
  - [颜色选择器](#颜色选择器)
- [高级功能](#高级功能)
  - [表单验证](#表单验证)
  - [主题系统](#主题系统)
- [API 参考](#api-参考)
- [浏览器兼容性](#浏览器兼容性)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 简介

FormLib 是一个轻量级的表单元素美化库，提供了比浏览器原生组件更美观、更易用的表单元素。它包含以下主要特性：

- 美观的输入框、按钮、对话框和颜色选择器组件
- 支持亮色和暗色主题切换
- 响应式设计，适配各种屏幕尺寸
- 丰富的动画效果和过渡效果
- 强大的表单验证功能
- 简单易用的 API

FormLib 的目标是帮助开发者快速创建美观、易用的表单界面，提升用户体验。

## 安装

### 通过 CDN 安装

最简单的使用方式是通过 CDN 引入 FormLib 的 CSS 和 JavaScript 文件：

```html
<!-- 引入 CSS 文件 -->
<link rel="stylesheet" href="https://aftreecn.github.io/formlib/css/formlib.css">

<!-- 引入 JavaScript 文件 -->
<script src="https://aftreecn.github.io/formlib/js/formlib.js"></script>
```

### 本地安装

1. 下载 FormLib 的最新版本
2. 将 `css/formlib.css` 和 `js/formlib.js` 文件复制到你的项目中
3. 在 HTML 文件中引入这些文件：

```html
<!-- 引入 CSS 文件 -->
<link rel="stylesheet" href="path/to/formlib.css">

<!-- 引入 JavaScript 文件 -->
<script src="path/to/formlib.js"></script>
```

## 快速开始

引入 FormLib 后，你可以立即开始使用它的组件。以下是一个简单的示例：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FormLib 快速开始</title>
    <!-- 引入 FormLib CSS -->
    <link rel="stylesheet" href="path/to/formlib.css">
</head>
<body>
    <div class="container">
        <h1>FormLib 示例表单</h1>
        
        <form>
            <!-- 输入框 -->
            <div class="formlib-input-group">
                <label class="formlib-input-label" for="name">姓名</label>
                <input type="text" id="name" class="formlib-input" placeholder="请输入姓名">
            </div>
            
            <!-- 按钮 -->
            <button type="button" class="formlib-btn formlib-btn-primary" id="show-dialog">
                显示对话框
            </button>
            
            <!-- 颜色选择器 -->
            <div data-formlib="colorpicker" data-default-color="#3b82f6"></div>
        </form>
    </div>
    
    <!-- 引入 FormLib JavaScript -->
    <script src="path/to/formlib.js"></script>
    
    <script>
        // 初始化 FormLib
        FormLib.init();
        
        // 显示对话框
        document.getElementById('show-dialog').addEventListener('click', function() {
            FormLib.Dialog.alert({
                title: '欢迎使用 FormLib',
                message: '这是一个简单的对话框示例！'
            });
        });
    </script>
</body>
</html>
```

## 组件文档

### 输入框

FormLib 提供了美观的输入框组件，支持各种状态和样式。

#### 基本用法

```html
<div class="formlib-input-group">
    <label class="formlib-input-label" for="username">用户名</label>
    <input type="text" id="username" class="formlib-input" placeholder="请输入用户名">
    <div class="formlib-input-hint">用户名长度为 3-20 个字符</div>
</div>
```

#### 状态变体

```html
<!-- 成功状态 -->
<input type="text" class="formlib-input success" value="验证通过">

<!-- 错误状态 -->
<input type="text" class="formlib-input error">
<div class="formlib-input-error">输入格式不正确</div>

<!-- 禁用状态 -->
<input type="text" class="formlib-input" disabled value="禁用状态">
```

#### 输入框类型

FormLib 支持所有标准的 HTML 输入类型：

```html
<!-- 文本输入 -->
<input type="text" class="formlib-input" placeholder="请输入文本">

<!-- 密码输入 -->
<input type="password" class="formlib-input" placeholder="请输入密码">

<!-- 数字输入 -->
<input type="number" class="formlib-input" placeholder="请输入数字">

<!-- 邮箱输入 -->
<input type="email" class="formlib-input" placeholder="请输入邮箱">

<!-- URL 输入 -->
<input type="url" class="formlib-input" placeholder="请输入 URL">

<!-- 日期输入 -->
<input type="date" class="formlib-input">

<!-- 文件输入 -->
<input type="file" class="formlib-input">
```

### 按钮

FormLib 提供了多样化的按钮样式，支持各种颜色和尺寸。

#### 基本用法

```html
<button class="formlib-btn">默认按钮</button>
```

#### 颜色变体

```html
<button class="formlib-btn formlib-btn-primary">主要按钮</button>
<button class="formlib-btn formlib-btn-secondary">次要按钮</button>
<button class="formlib-btn formlib-btn-success">成功按钮</button>
<button class="formlib-btn formlib-btn-danger">危险按钮</button>
<button class="formlib-btn formlib-btn-warning">警告按钮</button>
<button class="formlib-btn formlib-btn-info">信息按钮</button>
```

#### 尺寸变体

```html
<button class="formlib-btn formlib-btn-sm">小按钮</button>
<button class="formlib-btn">默认按钮</button>
<button class="formlib-btn formlib-btn-lg">大按钮</button>
```

#### 状态变体

```html
<!-- 禁用状态 -->
<button class="formlib-btn" disabled>禁用按钮</button>

<!-- 块级按钮 -->
<button class="formlib-btn formlib-btn-block">块级按钮</button>
```

#### 链接样式按钮

```html
<a href="#" class="formlib-btn formlib-btn-primary">链接按钮</a>
```

### 对话框

FormLib 提供了自定义的确认/取消对话框，支持自定义标题、消息和按钮文本。

#### 提示对话框

```javascript
FormLib.Dialog.alert({
    title: '提示信息',
    message: '这是一个提示对话框，用于显示重要信息。',
    buttonText: '我知道了',
    onClose: function() {
        console.log('对话框已关闭');
    }
});
```

#### 确认对话框

```javascript
FormLib.Dialog.confirm({
    title: '确认操作',
    message: '您确定要执行此操作吗？此操作不可撤销。',
    confirmText: '确定',
    cancelText: '取消',
    onConfirm: function() {
        console.log('用户点击了确定');
    },
    onCancel: function() {
        console.log('用户点击了取消');
    }
});
```

#### 对话框选项

对话框支持以下选项：

| 选项 | 类型 | 描述 | 默认值 |
|------|------|------|--------|
| title | string | 对话框标题 | '' |
| message | string | 对话框消息内容 | '' |
| confirmText | string | 确认按钮文本 | '确定' |
| cancelText | string | 取消按钮文本 | '取消' |
| showCancel | boolean | 是否显示取消按钮 | true (confirm) / false (alert) |
| onConfirm | function | 点击确认按钮的回调函数 | null |
| onCancel | function | 点击取消按钮的回调函数 | null |

### 颜色选择器

FormLib 提供了高级颜色选择器，支持预设颜色和自定义颜色输入。

#### 基本用法

```html
<div data-formlib="colorpicker" data-default-color="#3b82f6"></div>
```

#### 手动初始化

```javascript
const colorpicker = FormLib.ColorPicker.init(document.getElementById('colorpicker'), {
    defaultColor: '#3b82f6',
    onChange: function(color, isCustom) {
        console.log('选择的颜色:', color);
        console.log('是否自定义颜色:', isCustom);
    }
});
```

#### 颜色选择器方法

```javascript
// 获取当前颜色
const currentColor = colorpicker.getColor();

// 设置颜色
colorpicker.setColor('#ff0000');

// 销毁颜色选择器
colorpicker.destroy();
```

## 高级功能

### 表单验证

FormLib 提供了强大的表单验证功能，支持各种验证规则和实时反馈。

#### 基本用法

```html
<form data-formlib="form">
    <div class="formlib-input-group">
        <label class="formlib-input-label" for="username">用户名</label>
        <input 
            type="text" 
            id="username" 
            name="username"
            class="formlib-input" 
            data-required
            data-minlength="3"
            data-maxlength="20"
        >
    </div>
    
    <button type="submit" class="formlib-btn formlib-btn-primary">提交表单</button>
</form>
```

#### 手动初始化

```javascript
const validator = FormLib.FormValidator.init(document.getElementById('my-form'), {
    validateOnBlur: true,  // 失去焦点时验证
    validateOnChange: false, // 值改变时验证
    onSubmit: function(isValid, form, fields) {
        console.log('表单提交', { isValid, form, fields });
    },
    onSuccess: function(form) {
        console.log('表单验证成功');
    },
    onError: function(form, fields) {
        console.log('表单验证失败', fields);
    }
});
```

#### 验证规则

FormLib 支持以下验证规则：

| 规则 | 描述 | 示例 |
|------|------|------|
| data-required | 必填项 | `data-required` |
| data-email | 邮箱格式 | `data-email` |
| data-url | URL 格式 | `data-url` |
| data-min | 最小值 | `data-min="18"` |
| data-max | 最大值 | `data-max="120"` |
| data-minlength | 最小长度 | `data-minlength="6"` |
| data-maxlength | 最大长度 | `data-maxlength="20"` |
| data-pattern | 正则表达式 | `data-pattern="[A-Za-z0-9]+"` |

#### 自定义错误消息

```html
<input 
    type="email" 
    class="formlib-input" 
    data-required
    data-email
    data-required-message="邮箱地址不能为空"
    data-email-message="请输入有效的邮箱地址"
>
```

#### 验证器方法

```javascript
// 手动验证表单
const isValid = validator.validate();

// 重置表单
validator.reset();
```

### 主题系统

FormLib 支持亮色和暗色主题，可自动根据系统偏好设置，也可手动切换。

#### 主题切换

```javascript
// 设置亮色主题
FormLib.Theme.setTheme('light');

// 设置暗色主题
FormLib.Theme.setTheme('dark');

// 切换主题
const newTheme = FormLib.Theme.toggleTheme();

// 获取当前主题
const currentTheme = FormLib.Theme.getTheme();
```

#### 自动主题

```javascript
// 初始化主题（从本地存储或系统偏好加载）
FormLib.Theme.init();
```

#### 主题切换按钮

```html
<button data-formlib="theme-toggle">
    <i class="fa fa-moon-o dark:hidden"></i>
    <i class="fa fa-sun-o hidden dark:block"></i>
</button>
```

## API 参考

### FormLib.InputValidator

输入框验证工具，提供了各种验证方法。

#### 方法

```javascript
// 验证必填项
FormLib.InputValidator.required(value);

// 验证邮箱格式
FormLib.InputValidator.email(value);

// 验证 URL 格式
FormLib.InputValidator.url(value);

// 验证数字范围
FormLib.InputValidator.range(value, min, max);

// 验证字符串长度
FormLib.InputValidator.length(value, min, max);

// 验证正则表达式
FormLib.InputValidator.pattern(value, regex);
```

### FormLib.Dialog

对话框管理器，用于创建和管理对话框。

#### 方法

```javascript
// 显示提示对话框
FormLib.Dialog.alert(options);

// 显示确认对话框
FormLib.Dialog.confirm(options);

// 创建自定义对话框
FormLib.Dialog.createModal(options);

// 关闭对话框
FormLib.Dialog.close(backdrop);
```

### FormLib.ColorPicker

颜色选择器，用于选择和管理颜色。

#### 方法

```javascript
// 初始化颜色选择器
FormLib.ColorPicker.init(element, options);

// 选择颜色
FormLib.ColorPicker.selectColor(colorpicker, color, onChange, isCustom);

// 验证颜色值是否有效
FormLib.ColorPicker.isValidColor(color);
```

### FormLib.Theme

主题管理器，用于管理和切换主题。

#### 方法

```javascript
// 设置主题
FormLib.Theme.setTheme(theme);

// 获取当前主题
FormLib.Theme.getTheme();

// 切换主题
FormLib.Theme.toggleTheme();

// 初始化主题
FormLib.Theme.init();
```

### FormLib.FormValidator

表单验证器，用于验证表单。

#### 方法

```javascript
// 初始化表单验证
FormLib.FormValidator.init(form, options);

// 解析表单字段
FormLib.FormValidator.parseFields(form);

// 获取字段验证规则
FormLib.FormValidator.getRules(input);

// 验证单个字段
FormLib.FormValidator.validateField(field);

// 验证所有字段
FormLib.FormValidator.validateAll(fields);

// 更新字段 UI
FormLib.FormValidator.updateFieldUI(field);

// 重置表单
FormLib.FormValidator.resetForm(fields);
```

### FormLib.init

初始化所有 FormLib 组件。

```javascript
// 自动初始化所有组件
FormLib.init();
```

## 浏览器兼容性

FormLib 支持所有现代浏览器，包括：

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

FormLib 使用了一些现代 JavaScript 特性，如 ES6 的箭头函数、模板字符串等。如果你需要支持旧版浏览器，可能需要使用 Babel 进行转译。

## 贡献指南

我们欢迎社区贡献！如果你想为 FormLib 做出贡献，请遵循以下步骤：

1. Fork 项目仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

FormLib 采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。