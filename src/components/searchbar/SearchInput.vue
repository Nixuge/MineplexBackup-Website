<script setup lang="ts">
import { SearchEngine as se } from '@/ts/manager/SearchEngine';
import { onMounted } from 'vue';

let inputelement: HTMLInputElement;
onMounted(() => {
    inputelement = document.getElementById("searchinput") as HTMLInputElement;
    new GoThrougher().run()
});

class GoThrougher {
    private current_string_listindex: number;
    private current_string: string;
    private char_index: number;
    private strings: Array<string> = [
                    "game:thebridges Seretopia",
                    "builder:powh",
                    "nano:true game:gladiators Cavern"
                ];
    
    constructor() {
        this.current_string_listindex = 0;
        this.current_string = this.strings[this.current_string_listindex]
        this.char_index = 0;
    }

    private delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    private nextString() {
        if (this.current_string_listindex >= this.strings.length - 1)
            this.current_string_listindex = 0;
        else
            this.current_string_listindex += 1;
        
        this.current_string = this.strings[this.current_string_listindex];
    }
    
    public async run() {
        while (!false) {
            await this.goThrough();
            await this.delay(2000);
            await this.goThroughReverse();
            this.nextString();
            await this.delay(500);
        }
    }

    private async goThrough() {
        while (this.char_index < this.current_string.length) {
            inputelement.placeholder += this.current_string[this.char_index];
            await this.delay(40);
            this.char_index += 1;
        }
    }

    private async goThroughReverse() {
        while (this.char_index > 0) {
            const placeholderStr = inputelement.placeholder;
            inputelement.placeholder = placeholderStr.substring(0, placeholderStr.length - 1);
            await this.delay(30);
            this.char_index -= 1;
        }
    }
}



</script>

<template>
    <input id="searchinput" name="Search Input" placeholder="" @input="event => se.handleInputChange(event)">
</template>

<style scoped>

input {
    font-size: 20px;
    width: 100%;
    box-sizing: border-box;
    background: transparent;
    border: none;
    box-shadow: none;
    color: var(--text-color);
}

textarea:focus, input:focus{
    outline: none;
}
</style>