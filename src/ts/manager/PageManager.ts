import { reactive, ref, watch, watchEffect } from "vue";
import { updateUrl } from "./UrlManager";
import { SearchEngine } from "./SearchEngine";
import { PageButtonData, ButtonType, ButtonEffect } from "@/ts/data/PageButtonType";

export class PageManager {
    public static page = ref(1);
    public static pageSelector: PageButtonData[] = reactive([new PageButtonData(ButtonType.NORMAL, 1)]);

    public static setPage(_page: number) {
        if (_page > SearchEngine.currentLastPageIndex || _page < 1)
            return;
        this.page.value = _page;
        updateUrl();
    }

    public static nextPage() {
        this.page.value += 1;
        updateUrl();
    }

    public static previousPage() {
        if (this.page.value > 1) {
            this.page.value -= 1;
            updateUrl();
        }
    }

    public static getPage() {
        return this.page.value;
    }

    private static genPageListSimpleRange(lastIndex: number) {
        // Used if 10 or less pages shown
        for (let i = 1; i <= lastIndex; i++) {
            if (i == this.getPage()) {
                this.pageSelector.push(new PageButtonData(ButtonType.NORMAL, i, ButtonEffect.CURRENT));
            } else {
                this.pageSelector.push(new PageButtonData(ButtonType.NORMAL, i));
            }
        }
    }

    private static genPageListComplicated(lastIndex: number) {
        // Used if 11 or more pages shown
        const currentPage = this.getPage();
        let totalToDoAfter = 5;

        // before current page
        for (let i = currentPage - 4; i < currentPage; i++) {
            if (i < 1) {
                totalToDoAfter++;
                continue;
            }
            this.pageSelector.push(new PageButtonData(ButtonType.NORMAL, i));
        }

        // current page
        this.pageSelector.push(new PageButtonData(ButtonType.NORMAL, currentPage, ButtonEffect.CURRENT));

        // after current page
        const maxLoopIndex = currentPage + totalToDoAfter;
        let overflow = 0
        for (let i = currentPage + 1; i < maxLoopIndex; i++) {
            if (i > lastIndex) {
                overflow = maxLoopIndex - i
                break;
            }
            this.pageSelector.push(new PageButtonData(ButtonType.NORMAL, i));
        }

        // balance out overflow by adding before
        if (overflow > 0) {
            for (let i = currentPage - 5; i > currentPage - 5 - overflow; i--) {
                if (i < 1)
                    break;
                this.pageSelector.unshift(new PageButtonData(ButtonType.NORMAL, i));
            }
        }

    }

    public static genPageListSelect() {
        this.pageSelector.length = 0;

        const lastIndex = SearchEngine.currentLastPageIndex;
        const currentPage = this.getPage();

        if (lastIndex < 11)
            this.genPageListSimpleRange(lastIndex);
        else
            this.genPageListComplicated(lastIndex);


        this.pageSelector.unshift(new PageButtonData(
            ButtonType.PREVIOUS, undefined,
            (currentPage <= 1) ? ButtonEffect.DISABLED : undefined));


        this.pageSelector.push(new PageButtonData(
            ButtonType.NEXT, undefined,
            (currentPage >= lastIndex) ? ButtonEffect.DISABLED : undefined));
    }

    public static onScroll(event: any) {
        if (!isHovering.value)
            return;

        event.preventDefault()
        if (event.deltaY < 0)
            this.setPage(this.getPage() + 1)
        else
            this.setPage(this.getPage() - 1)
    }

    private static grid: HTMLElement;
    private static pageSelect: HTMLElement
    public static setElementsForOffset(grid: HTMLElement, pageSelect: HTMLElement) {
        this.grid = grid;
        this.pageSelect = pageSelect;
    }


    public static finalPos = ref(0);
    public static maxWidth = ref("95vw");
    public static updateOffsets() {   
        const grid = this.grid;
        const pageSelect = this.pageSelect;
             
        const gridMid = grid.clientWidth / 2;
        const posLeft = gridMid - (pageSelect.clientWidth / 2);
        this.finalPos.value = grid.offsetLeft + posLeft;
        
        const posDiff = (pageSelect.clientLeft + pageSelect.clientWidth) - (grid.clientLeft + grid.clientWidth);
        // If goes to the right too much when centered
        if (posDiff > 0) {        
            this.finalPos.value = grid.offsetLeft;
        }
        // If is goes to the right too much when centered AND is wider
        if (pageSelect.clientWidth > grid.clientWidth) {
            this.maxWidth.value = grid.clientWidth + "px"
        }
        // Reset default value to keep full width otherwise
        else {
            this.maxWidth.value = "95vw"
        }
    }
}

export let isHovering = ref(false);

// {passive: false} Needed to preventDefault()
addEventListener("wheel", (event) => { PageManager.onScroll(event) }, {passive: false}); 

watch(PageManager.page, () => {
    // works for reactivity tracking
    // TODO: rework by watching the URL instead
    PageManager.genPageListSelect();
});

// Basically did a loop import between PageButtonType & PageManager
// & I couldn't set those functions by default so just replacing them
// after PageManager is initialized lmao
function dirtyTypeEnumFix() {
    ButtonType.NORMAL.func = PageManager.setPage;
    ButtonType.NEXT.func = PageManager.nextPage;
    ButtonType.PREVIOUS.func = PageManager.previousPage;
}
dirtyTypeEnumFix()