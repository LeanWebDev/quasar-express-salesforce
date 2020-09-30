const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/auth", component: () => import("pages/PageAuth.vue") },
      { path: "", component: () => import("pages/Index.vue") },
      { path: "/account", component: () => import("pages/Account.vue") },
      {
        path: "/account/:accountId",
        component: () => import("pages/AccountDetail.vue")
      },
      {
        path: "/opti-account/:accountId",
        component: () => import("pages/OptiAccountDetail.vue")
      },
      { path: "/contact", component: () => import("pages/Contact.vue") },
      {
        path: "/contact/:contactId",
        component: () => import("pages/ContactDetail.vue")
      },
      { path: "/case", component: () => import("pages/Case.vue") },
      { path: "/case-table", component: () => import("pages/CaseTable.vue") },
      {
        path: "/case/:caseObjectId",
        component: () => import("pages/CaseDetail.vue")
      },
      {
        path: "/email-message",
        component: () => import("pages/EmailMessage.vue")
      },
      {
        path: "/cloud-functions",
        component: () => import("pages/CloudFunctions.vue"),
        meta: {
          requiresAuth: true
        }
      },
      { path: "/product", component: () => import("pages/Product.vue") },
      {
        path: "/product/:productId",
        component: () => import("pages/ProductDetail.vue")
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
