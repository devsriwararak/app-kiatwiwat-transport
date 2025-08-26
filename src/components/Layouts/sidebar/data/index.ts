import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "ADMIN",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/admins/home",
        items: [],
      },
      {
        title: "ข้อมูลพื้นฐาน",
        icon: Icons.User,
        items: [
          {
            title: "ข้อมูลพนักงาน",
            url: "/admins/defaults/members",
          },
          {
            title: "ข้อมูลสินค้า",
            url: "/admins/defaults/products",
          },
        ],
      },
      {
        title: "ตั้งค่าระบบ",
        icon: Icons.FourCircle,
        items: [
          {
            title: "ผ่อน",
            url: "/admins/settings/installment",
          },
          {
            title: "เช่า",
            url: "/admins/settings/rental-fees",
          },
        ],
      },
      {
        title: "รายงาน",
        icon: Icons.PieChart,
        items: [
          {
            title: "รายงานยอดขาย",
            url: "/admins/reports/sales",
          },
          {
            title: "รายงานค้างจ่าย",
            url: "/admins/reports/accounts-payable",
          },
        ],
      },
      // {
      //   title: "Dashboard",
      //   icon: Icons.HomeIcon,
      //   items: [
      //     {
      //       title: "eCommerce",
      //       url: "/",
      //     },
      //   ],
      // },
      // {
      //   title: "Calendar",
      //   url: "/calendar",
      //   icon: Icons.Calendar,
      //   items: [],
      // },
      // {
      //   title: "Profile",
      //   url: "/profile",
      //   icon: Icons.User,
      //   items: [],
      // },
      // {
      //   title: "Forms",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "Form Elements",
      //       url: "/forms/form-elements",
      //     },
      //     {
      //       title: "Form Layout",
      //       url: "/forms/form-layout",
      //     },
      //   ],
      // },
      // {
      //   title: "Tables",
      //   url: "/tables",
      //   icon: Icons.Table,
      //   items: [
      //     {
      //       title: "Tables",
      //       url: "/tables",
      //     },
      //   ],
      // },
      // {
      //   title: "Pages",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "Settings",
      //       url: "/pages/settings",
      //     },
      //   ],
      // },
    ],
  },

  {
    label: "OTHER",
    items: [

      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          {
            title: "eCommerce",
            url: "/",
          },
        ],
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Icons.Calendar,
        items: [],
      },
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Forms",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Form Elements",
            url: "/forms/form-elements",
          },
          {
            title: "Form Layout",
            url: "/forms/form-layout",
          },
        ],
      },
      {
        title: "Tables",
        url: "/tables",
        icon: Icons.Table,
        items: [
          {
            title: "Tables",
            url: "/tables",
          },
        ],
      },
      {
        title: "Pages",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Settings",
            url: "/pages/settings",
          },
        ],
      },
    ],
  },
  {
    label: "MEMBER",
    items: [
      {
        title: "Charts",
        icon: Icons.PieChart,
        items: [
          {
            title: "Basic Chart",
            url: "/charts/basic-chart",
          },
        ],
      },
      {
        title: "UI Elements",
        icon: Icons.FourCircle,
        items: [
          {
            title: "Alerts",
            url: "/ui-elements/alerts",
          },
          {
            title: "Buttons",
            url: "/ui-elements/buttons",
          },
        ],
      },
      {
        title: "Authentication",
        icon: Icons.Authentication,
        items: [
          {
            title: "Sign In",
            url: "/auth/sign-in",
          },
        ],
      },
    ],
  },
];
