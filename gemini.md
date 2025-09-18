
# 基于LLM的生产级Web应用生成器 - 设计框架 (V8 - Final)

## 1. 愿景与目标

**愿景:** 创建一个AI驱动的**动态应用平台 (Dynamic Application Platform)**，它能将自然语言需求**实时转化**为可立即使用的业务应用，无需任何构建或部署等待。

**核心目标:**
- **即时创造:** 用户通过对话创造的应用，在点击“完成”的瞬间即可被终端用户访问和使用。
- **运行时驱动:** 彻底摒弃编译、构建和部署流程，所有应用的定义和逻辑均在运行时动态加载和执行。
- **安全沙箱:** 在提供极致灵活性的同时，通过沙箱机制确保动态生成代码的安全执行。

---

## 2. 系统定位：真正的“动态应用平台”

本系统进化为真正的**动态应用平台**。与V6版本最大的区别在于，我们彻底抛弃了基于Git和CI/CD的“编译时”思维，转向了完全的“运行时”架构。代码不再是部署产物，而是与用户数据一样，是存储在数据库中的一种**可执行资产**。

---

## 3. 面向企业的核心功能：主数据管理

(与V6版本相同，作为系统的业务上下文基础)

---

## 4. 运行时动态应用架构

**核心思想:** 应用的“形态”和“行为”都以结构化定义的形式存储在数据库中。前端是一个通用的“应用渲染器”，后端是一套通用的“记录处理API”。它们根据从数据库中读取的应用定义，来动态地改变自己的外观和行为。

(架构图与V7版本相同)

### 4.1. 关键组件
- **动态应用渲染器 (Dynamic App Renderer):** 前端核心，一个高度通用的React组件。它在运行时从数据库获取指定应用的“UI定义(JSON)”，然后解析该JSON并动态渲染出对应的UI界面。
- **安全沙箱 (Secure Sandbox):** 一个运行在Web Worker中的隔离环境。从数据库获取的“前端逻辑(JS)”代码片段在此执行，可以进行计算和数据处理，但无法直接访问主页面的DOM或全局变量，只能通过`postMessage`与渲染器安全通信。
- **通用后端API (Generic Backend API):** 一套固定的、与具体业务无关的API，如`POST /api/records/:app_type`。它接收到请求后，会从数据库加载该`app_type`对应的“后端校验规则(JSON)”，验证通过后才将数据存入`business_records`表的`jsonb`字段。

---

## 5. 核心工作流程 (动态运行时模型)

(与V7版本相同)

---

## 6. 动态运行时实现方案

(与V7版本相同)

---

## 7. 动态运行时架构的核心挑战

(与V7版本相同)

---

## 8. 初始实现切片 (MVP Slice)

**目标:** 为了在编码开始后能尽快看到一个可触摸、可验证的结果，我们定义了以下MVP切片。它将暂时绕过LLM，通过硬编码一个应用定义来打通整个核心流程。

### 8.1. MVP范围

1.  **主数据:** 不涉及数据库，在后端通过一个`products.json`文件提供几个产品数据即可。
2.  **应用定义:** 不涉及LLM，在数据库的`app_definitions`表中手动插入一条记录，代表“采购申请单”应用。
3.  **UI渲染器:** `DynamicAppRenderer`只需支持`Page`, `Form`, `Input`, `Button`四个组件的渲染。
4.  **沙箱逻辑:** `frontend_logic`只需实现接收表单数据并将其传递回主线程的功能。
5.  **后端API:** `POST /api/records/purchase_requisition`只需接收数据并将其`console.log`出来即可，暂不存入数据库。

### 8.2. 关键实现规格 (硬编码示例)

**A. `app_definitions` 表中的硬编码记录:**

- **app_type:** `purchase_requisition`
- **ui_definition (JSON):**
  ```json
  {
    "version": "1.0",
    "layout": {
      "component": "Page",
      "title": "New Purchase Requisition",
      "children": [
        {
          "component": "Form",
          "name": "requisitionForm",
          "onSubmit": { "action": "submitForm" },
          "children": [
            { "component": "Input", "name": "department", "label": "Department" },
            { "component": "Input", "name": "total_price", "label": "Total Price", "type": "number" },
            { "component": "Button", "label": "Submit", "type": "submit" }
          ]
        }
      ]
    }
  }
  ```
- **frontend_logic (TEXT):**
  ```javascript
  // This code runs inside the Web Worker sandbox
  self.onmessage = function(event) {
    const { action, payload } = event.data;
    if (action === 'submitForm') {
      console.log('Sandbox received form data:', payload);
      // For MVP, just pass the data back to the main thread for submission.
      self.postMessage({ action: 'dispatchSubmit', payload: payload });
    }
  };
  ```
- **backend_schema (JSON):**
  ```json
  {
    "type": "object",
    "properties": {
      "department": { "type": "string", "minLength": 2 },
      "total_price": { "type": "number", "minimum": 0 }
    },
    "required": ["department", "total_price"]
  }
  ```

**B. API 交互流程:**

1.  `DynamicAppRenderer`中的`Form`组件在提交时，不会直接调用`fetch`。
2.  它会调用`worker.postMessage({ action: 'submitForm', payload: formData })`将表单数据发送到沙箱。
3.  沙箱中的`frontend_logic`代码执行，处理完毕后，调用`self.postMessage({ action: 'dispatchSubmit', payload: processedData })`将数据发回。
4.  `DynamicAppRenderer`监听worker的消息，收到`dispatchSubmit`后，才真正执行`fetch('/api/records/purchase_requisition', ...)`。

### 8.3. 预期结果

- **启动:** 开发者`npm run dev`后，打开浏览器，应能看到一个包含“采购申请单”链接的门户页面。
- **渲染:** 点击链接，页面应根据硬编码的`ui_definition`渲染出一个包含两个输入框和一个按钮的表单。
- **交互与提交:** 填写表单并点击提交后：
    - 浏览器开发工具的Console中，应能看到沙箱打印的`'Sandbox received form data: ...'`。
    - 浏览器开发工具的Network面板中，应能看到一个向`/api/records/purchase_requisition`发起的POST请求，其payload为表单数据。
    - 后端服务的控制台中，应能看到API打印出的接收到的数据。

这个MVP切片一旦完成，就证明了整个动态架构的核心通路是可行的，后续便可在此基础上，逐步替换掉硬编码部分，并集成LLM。
