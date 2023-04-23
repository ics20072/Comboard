import { createRouter } from "vue-router";
import { createWebHistory } from "vue-router";

import store from "./store";

import IndexPage from "./components/pages/IndexPage.vue";
import RegisterPage from "./components/pages/auth/RegisterPage.vue";
import LoginPage from "./components/pages/auth/LoginPage.vue";
import ForgotPasswordPage from "./components/pages/auth/ForgotPasswordPage.vue";
import DashboardPage from "./components/pages/DashboardPage.vue";
import CreateOrganization from "./components/dashboard/CreateOrganization.vue";
import OrganizationPage from "./components/pages/OrganizationPage.vue";
import NetworkTab from "./components/organization/network/NetworkTab.vue";
import CalendarTab from "./components/organization/calendar/CalendarTab.vue";
import TasksTab from "./components/organization/tasks/TasksTab.vue";
import ProjectsTab from "./components/organization/projects/ProjectsTab.vue";
import AllProjectsTab from "./components/organization/projects/AllProjectsTab.vue";
import MyProjectsTab from "./components/organization/projects/MyProjectsTab.vue";
import TeamsTab from "./components/organization/teams/TeamsTab.vue";
import MyTeamsTab from "./components/organization/teams/MyTeamsTab.vue";
import AllTeamsTab from "./components/organization/teams/AllTeamsTab.vue";
import CreateTeam from "./components/organization/teams/CreateTeam.vue";
import StorageTab from "./components/organization/storage/StorageTab.vue";
import PermissionDeniedPage from "./components/pages/PermissionDeniedPage.vue";
import NotFoundPage from "./components/pages/NotFoundPage.vue";
import UserProfile from "./components/organization/profile/user/UserProfile.vue";
import UserDashboardProfile from "./components/dashboard/UserDashboardProfile.vue";
import UserProfilePosts from "./components/organization/profile/user/UserProfilePosts.vue";
import UserProfileConnections from "./components/organization/profile/user/UserProfileConnections.vue";
import UserProfileSettings from "./components/organization/profile/user/UserProfileSettings.vue";
import HelpPage from "./components/dashboard/HelpPage.vue";
import UserProfileTeams from "./components/organization/profile/user/UserProfileTeams.vue";
import UserProfileProjects from "./components/organization/profile/user/UserProfileProjects.vue";
import TeamPrivateProfile from "./components/organization/profile/team/TeamPrivateProfile.vue";
import TeamPublicProfile from "./components/organization/profile/team/TeamPublicProfile.vue";
import CreateProject from "./components/organization/projects/CreateProject.vue";
import OrganizationPrivateProfile from "./components/organization/profile/organization/OrganizationPrivateProfile.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: IndexPage,
    },
    {
      path: "/register",
      component: RegisterPage,
      meta: {
        requiresNonAuthenticated: true,
      },
    },
    {
      path: "/login",
      component: LoginPage,
      meta: {
        requiresNonAuthenticated: true,
      },
    },
    {
      path: "/retrieve-password/",
      component: ForgotPasswordPage,
      meta: {
        requiresNonAuthenticated: true,
      },
      children: [
        {
          path: "step-1",
          component: ForgotPasswordPage,
        },
        {
          path: "step-2",
          component: ForgotPasswordPage,

          beforeEnter: (to, _, next) => {
            if (store.getters.getStep1) {
              next();
            } else {
              next("/retrieve-password/step-1");
            }
          },
        },
        {
          path: "step-3",
          component: ForgotPasswordPage,

          beforeEnter: (to, _, next) => {
            if (store.getters.getStep2) {
              next();
            } else {
              next("/retrieve-password/step-2");
            }
          },
        },
        {
          path: "step-4",
          component: ForgotPasswordPage,
          meta: {
            requiresStep: true,
          },

          beforeEnter: (to, _, next) => {
            if (store.getters.getStep3) {
              next();
            } else {
              next("/retrieve-password/step-3");
            }
          },
        },
      ],
    },
    {
      path: "/dashboard",
      component: DashboardPage,
      meta: {
        requiresAuthenticaton: true,
      },
    },
    {
      path: "/dashboard/my-profile",
      component: UserDashboardProfile,
    },
    {
      path: "/dashboard/help",
      component: HelpPage,
    },
    {
      path: "/create-organization",
      component: CreateOrganization,
      meta: {
        requiresAuthenticaton: true,
      },
    },
    {
      path: "/organization/my-profile",
      component: UserProfile,
      redirect: "/organization/my-profile/posts",
      children: [
        {
          path: "posts",
          component: UserProfilePosts,
        },
        {
          path: "connections",
          component: UserProfileConnections,
        },
        {
          path: "settings",
          component: UserProfileSettings,
        },
      ],
    },
    {
      path: "/organization/my-organization",
      component: OrganizationPrivateProfile,
    },
    {
      path: "/organization/team-private/:teamID",
      component: TeamPrivateProfile,
      props: true,
      children: [
        {
          name: "create-project",
          path: "new-project",
          components: {
            dialog: CreateProject,
          },
        },
      ],
    },
    {
      path: "/organization/team-public",
      component: TeamPublicProfile,
    },
    {
      path: "/organization/user",
      component: UserProfile,
      children: [
        {
          path: "teams",
          component: UserProfileTeams,
        },
        {
          path: "projects",
          component: UserProfileProjects,
        },
      ],
    },
    {
      path: "/organization",
      component: OrganizationPage,
      redirect: "/organization/network",
      meta: {
        requiresAuthenticaton: true,
      },
      children: [
        {
          path: "network",
          component: NetworkTab,
        },
        {
          path: "calendar",
          component: CalendarTab,
        },
        {
          path: "tasks",
          component: TasksTab,
        },
        {
          path: "projects",
          component: ProjectsTab,
          redirect: "/organization/projects/participate",
          children: [
            {
              path: "participate",
              component: MyProjectsTab,
            },
            {
              path: "all",
              component: AllProjectsTab,
            },
          ],
        },
        {
          path: "teams",
          component: TeamsTab,
          redirect: "/organization/teams/participate",
          children: [
            {
              path: "participate",
              component: MyTeamsTab,
              children: [
                {
                  path: "new",
                  components: {
                    dialog: CreateTeam,
                  },
                },
              ],
            },
            {
              path: "all",
              component: AllTeamsTab,
              children: [
                {
                  path: "new",
                  components: {
                    dialog: CreateTeam,
                  },
                },
              ],
            },
          ],
        },
        {
          path: "teams",
          component: TeamsTab,
        },
        {
          path: "storage",
          component: StorageTab,
        },
      ],

      beforeEnter: (_1, _2, next) => {
        if (!store.getters.isOrganizationSelected) {
          next("/dashboard");
        } else {
          next();
        }
      },
    },
    {
      path: "/permission-denied",
      component: PermissionDeniedPage,
    },
    {
      path: "/:pathMatch(.*)",
      component: NotFoundPage,
    },
  ],
});

// Register a global nav guard for user auth
router.beforeEach(function (to, _, next) {
  if (to.meta.requiresAuthenticaton && !store.getters.isAuthenticated) {
    next("/permission-denied");
  } else if (to.meta.requiresNonAuthenticated && store.getters.isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
