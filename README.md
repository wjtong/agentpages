# AgentPages: AI 驱动的企业应用平台

本平台旨在通过自然语言交互，赋能用户快速构建、迭代和部署企业级 Web 应用，极大降低开发门槛，提升交付效率。

## 1. 需求分析 (Requirements Analysis)

### 1.1. 项目目标

*   **核心价值:** 让非专业开发者（如业务分析师、产品经理）或专业开发者能够通过自然语言快速创建功能性网页应用。
*   **主要功能:** 用户通过对话式界面描述需求，AI 自动生成前端代码、后端逻辑，并实时展示页面。系统需支持数据持久化，如表单数据提交后的存储。
*   **最终产物:** 一个可交互、可部署、可存储数据的 Web 应用。

### 1.2. 核心功能

1.  **自然语言理解与处理 (NLU/NLP):**
    *   系统需能准确理解用户关于页面布局、UI 组件、业务逻辑的描述。
    *   例如：“创建一个用户注册页面，需要有用户名、密码和确认密码输入框，以及一个注册按钮”、“用户提交后，将信息保存起来”。

2.  **AI 代码生成:**
    *   **前端:** 根据用户描述生成相应的 HTML, CSS, 和 JavaScript 代码。框架可选用 React/Vue 等现代框架以支持动态交互。
    *   **后端:** 自动生成处理前端请求的 API 接口，例如处理表单提交的 `POST` 请求。
    *   **数据模型:** 根据用户需求（如“用户信息需要包含姓名、邮箱和电话”），自动生成相应的数据结构或数据库表结构。

3.  **实时页面预览:**
    *   提供一个实时渲染的窗口，当 AI 生成或修改代码后，页面应立即刷新，展示最新的效果。

4.  **数据交互与持久化:**
    *   生成的页面（如表单）应具备与后端交互的能力。
    *   用户通过表单提交的数据，后端服务应能接收、校验并将其存储到数据库中。
    *   例如：用户在生成的“联系我们”表单中填写信息并提交，系统后台应能将这些信息记录到数据库的 `contacts` 表中。

### 1.3. 用户交互流程

1.  **输入:** 用户在对话框中输入需求，如 "创建一个产品展示页面"。
2.  **生成与预览:** AI 生成初始代码，并在预览区展示一个基本的产品页面。
3.  **迭代:** 用户继续输入指令进行修改，如 "增加一个价格标签和一个购买按钮"。AI 更新代码，预览区实时变化。
4.  **后端逻辑:** 用户输入 "点击购买按钮后，记录下产品名称和用户信息"。AI 生成后端 API 和数据库逻辑。
5.  **交互测试:** 用户可在预览页面进行操作（如点击按钮），测试完整的前后端交互。
6.  **部署(远期):** 用户对应用满意后，可以一键部署，获得公开访问的 URL。

## 2. 架构设计 (Architecture Design)

为了实现上述需求，系统将采用前后端分离的微服务架构。

### 2.1. 系统组件图 (Conceptual)

```
+------------------+      +---------------------+      +---------------------+
|   Frontend UI    | <--> |   Backend Gateway   | <--> |  AI Core Service    |
| (Chat + Preview) |      |      (API Server)   |      | (LLM + Logic)       |
+------------------+      +---------------------+      +----------+----------+
                                     |                             |
                                     |                             |
               +---------------------v---------------------+       |
               |         Dynamic Application Server        |       |
               | (Serves & Executes Generated Application) |       |
               +-------------------------------------------+       |
                                     |                             |
                                     |                             |
               +---------------------v---------------------+       |
               |           Data Persistence Service        |<------+
               |          (Database + Storage API)         |
               +-------------------------------------------+
```

### 2.2. 组件说明

1.  **Frontend UI (前端界面):**
    *   **技术栈:** React, Vue, or similar modern JavaScript framework.
    *   **职责:**
        *   提供一个对话界面供用户输入自然语言指令。
        *   提供一个 `iframe` 或 `div` 作为实时预览区，用于渲染 AI 生成的页面。
        *   管理与后端服务的 WebSocket 或 HTTP 通信。

2.  **Backend Gateway (后端网关):**
    *   **技术栈:** Node.js (Express/Fastify) or Python (FastAPI).
    *   **职责:**
        *   作为系统的统一入口，接收前端 UI 的所有请求。
        *   将用户的自然语言指令转发给 AI 核心服务。
        *   管理用户会话和状态。

3.  **AI Core Service (AI 核心服务):**
    *   **技术栈:** Python (LangChain, LlamaIndex, etc.) + LLM API (e.g., Gemini).
    *   **职责:**
        *   接收指令，理解用户意图。
        *   维护当前应用代码的上下文状态。
        *   调用大语言模型（LLM）生成或修改代码（前端 UI、后端 API）。
        *   将生成的代码分发给相应的服务（应用服务器、数据持久化服务）。

4.  **Dynamic Application Server (动态应用服务器):**
    *   **技术栈:** Node.js or a lightweight web server.
    *   **职责:**
        *   接收 AI 生成的前端代码（HTML/CSS/JS）。
        *   动态地、安全地执行或托管这些代码。
        *   将渲染后的页面提供给前端 UI 的预览区。
        *   托管为处理数据提交而生成的后端 API。

5.  **Data Persistence Service (数据持久化服务):**
    *   **技术栈:** PostgreSQL/MongoDB + a simple data API (e.g., PostgREST or custom-built).
    *   **职责:**
        *   根据 AI 服务的指令，动态创建或修改数据表/集合。
        *   提供内部 API，供动态应用服务器上的生成代码调用，以实现数据的增删改查（CRUD）。

### 2.3. 数据流示例 (创建并提交表单)

1.  **User:** "创建一个联系人表单，包含姓名和邮箱字段"。
2.  **Frontend UI** -> **Backend Gateway** -> **AI Core Service**: 转发用户指令。
3.  **AI Core Service**:
    *   调用 LLM 生成 React 组件代码（一个表单）。
    *   调用 LLM 生成一个 Node.js Express `POST` /api/contacts` 接口用于接收表单数据。
    *   向 **Data Persistence Service** 发出指令，确保 `contacts` 表存在，且包含 `name` 和 `email` 字段。
4.  **AI Core Service** -> **Dynamic Application Server**: 发送生成的 React 和 Node.js 代码。
5.  **Dynamic Application Server**:
    *   启动/更新应用，渲染表单。
    *   将渲染结果的 URL 返回给 **Frontend UI** 的预览区。
6.  **User**: 在预览区填写表单并点击“提交”。
7.  **Preview (iframe)**: 表单 `POST` 数据到 **Dynamic Application Server** 上的 `/api/contacts` 接口。
8.  **Dynamic Application Server** -> **Data Persistence Service**: 运行中的接口代码调用数据服务，将 `{name: "...", email: "..."}` 存入数据库。
9.  **Feedback**: 接口返回成功信息，预览区显示“提交成功”。