import { createApp } from "vue";

import router from "./router.js";
import store from "./store/index.js";

// Import components
import App from "./App.vue";
import BaseSection from "./components/basic-components/BaseSection.vue";

/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { faListCheck } from "@fortawesome/free-solid-svg-icons";
import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import { faHandshakeSimple } from "@fortawesome/free-solid-svg-icons";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faSquareCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";

/* add icons to the library */
library.add(faPeopleGroup);
library.add(faCalendarDays);
library.add(faListCheck);
library.add(faDiagramProject);
library.add(faHandshakeSimple);
library.add(faBoxOpen);
library.add(faSun);
library.add(faMoon);
library.add(faBars);
library.add(faSquareCaretDown);
library.add(faBell);
library.add(faInbox);
library.add(faVideo);
library.add(faEllipsisVertical);
library.add(faHeart);
library.add(faComment);

const app = createApp(App);

app.use(router);
app.use(store);

//Register global components
app.component("base-section", BaseSection);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount("#app");
