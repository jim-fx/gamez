import { withSubComponents } from "$lib/utils";
import Tab from "./Tab.svelte";
import TabContent from "./TabContent.svelte";

export default withSubComponents(Tab, { Content: TabContent });
