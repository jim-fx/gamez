import { withSubComponents } from "$lib/utils";
import TabContent from "./TabContent.svelte";
import TabWrapper from "./TabWrapper.svelte";

export default withSubComponents(TabWrapper, { Content: TabContent });
