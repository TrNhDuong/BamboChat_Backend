# Deploying BamboChat to Azure 🚀

This guide documents the exact steps used to deploy the BamboChat backend to Azure using **Azure App Service for Containers**.

---

## 🏗️ Step 1: Create Azure Container Registry (ACR)

1.  **Create Registry**: Search for "Container registries" in Azure Portal and create one (e.g., named `BamboChat`).
2.  **Enable Admin User (CRITICAL)**:
    - Go to your ACR -> **Settings** -> **Access keys**.
    - Toggle **Admin user** to **Enabled**. This allows the Web App to pull images using simple credentials.

---

## 📦 Step 2: Push Image to Registry

### Option A: Build directly on Azure (Recommended)
In your project folder, run:
```powershell
az acr build --registry BamboChat --image bambochat-backend:v1 .
```

### Option B: Build locally and Push
1.  **Login**: `az acr login --name BamboChat`
2.  **Tag**: `docker tag bambochat-backend:latest bambochat.azurecr.io/bambochat-backend:v1`
3.  **Push**: `docker push bambochat.azurecr.io/bambochat-backend:v1`

---

## 🚀 Step 3: Create & Configure Web App

1.  **Create Web App**:
    - Publish: **Docker Container**.
    - Operating System: **Linux**.
2.  **Deployment Center**:
    - Source: **Azure Container Registry**.
    - Authentication: **Admin credentials**.
    - Registry: `BamboChat`.
    - Port: Đổi từ 80 thành **5000**.
3.  **Environment Variables (CRITICAL)**:
    - Go to **Settings** -> **Environment variables**.
    - Use **Advanced edit** to paste all variables from `.env` in JSON format.
    - **Required**: Add `"WEBSITES_PORT": "5000"`.

---

## ✅ Step 4: Verification
Access your health check endpoint:
`https://<your-app-name>.azurewebsites.net/api/health`

**Expected result:** `{"status":"OK", ...}`

---

## 🔄 Updating the Application

Khi bạn có thay đổi về code, hãy làm theo các bước sau để cập nhật lên Azure:

### 1. Build và Push bản mới
Bạn nên tăng version của tag (ví dụ từ `v1` lên `v2`) để dễ quản lý:
```powershell
az acr build --registry BamboChat --image bambochat-backend:v2 .
```

### 2. Cập nhật Web App
- Vào Azure Portal -> Web App -> **Deployment Center**.
- Đổi **Tag** từ `v1` sang `v2`.
- Nhấn **Save**. Azure sẽ tự động kéo bản mới về và restart.

---

## ⚡ Step 5: Automate with CI/CD (GitHub Actions)

The project uses a custom GitHub Actions workflow for direct control over the deployment process using the Azure CLI.

### 1. Configuration (GitHub Secrets/Variables)
Ensure these items are configured in your GitHub Repo -> **Settings** -> **Secrets and variables** -> **Actions**:
*   `AZUREAPPSERVICE_CLIENTID_...`
*   `AZUREAPPSERVICE_TENANTID_...`
*   `AZUREAPPSERVICE_SUBSCRIPTIONID_...`

### 2. Authentication (Secure OIDC)
Instead of using a long-lived Client Secret, we use **OIDC**:
1.  Go to Azure Portal -> **Microsoft Entra ID** -> **App registrations**.
2.  Select your Service Principal -> **Certificates & secrets** -> **Federated credentials**.
3.  Add a credential for the GitHub repository and branch (`main`).

### 3. Workflow Mechanism (`main_bambochat.yml`)
The current pipeline performs these steps on every push to `main`:
1.  **Azure Login (OIDC)**: Authenticates using the client/tenant/subscription IDs.
2.  **Local Docker Build**: Builds the image on the GitHub Actions runner (Ubuntu VM).
3.  **Local Docker Push**: Pushes the image to ACR (`bambochat.azurecr.io`).
4.  **Native CLI Deployment**:
    - Updates the ACR to allow admin access if needed.
    - Retrieves ACR credentials dynamically.
    - Forces the Web App to use the new image tag (using `github.sha`) via `az webapp config container set`.

> [!TIP]
> This "Native CLI" strategy is more reliable than standard marketplace actions because it bypasses the `TasksOperationsNotAllowed` errors often encountered with `az acr build`.

---

## 📝 Important Notes
*   **CORS**: Remember to update your CORS settings in `src/server.js` if your frontend is hosted on a different Azure URL.
*   **Database**: Ensure your MongoDB Atlas allows connections from Azure's IP addresses (or allow all IPs `0.0.0.0/0` temporarily).
*   **Logs**: You có thể xem live logs tại mục **Monitoring > Log stream** trong Azure Portal.
