<script setup lang="ts">
// Note about iconLinks:
// They were originally done with an array of a class called ClickableIcon (ClickableIcon[]).
// However, found out the Vue compiler doesn't handle class instanciations in component props,
// and throws an error in prod (but not in dev lol), so switched to good old arrays.
const props = defineProps<{
    serverName: string,
    serverUrl: string,
    thumbnailName: string,
    death?: string,
    message?: string,
    country: string,
    iconLinks?: [string, string, string][]
}>()

const BASE_URL = (process.env.NODE_ENV == "development") ? 
    "https://maps.nixuge.me/static/" : 
    "static/";

const WEBSITES_URL = BASE_URL + "websites/";
const THUMB_URL = BASE_URL + "server_thumbnails/";
const FLAG_URL = BASE_URL + "flags/";

function redirect(link: string | undefined) {
    if (link === undefined)
        return;
    window.location.href = link;
}

// Have things go from right to left.
// To adapt if I change the padding.
// Currently 65 = 50(img) + 2x5(padding) + 5 (margin-left)
const marginLeft: string = (props.iconLinks === undefined) ? "" : (140 - (65 * (props.iconLinks.length - 1))) + "px";
</script>

<template>
    <div class="serverentry" @click="$router.push('/' + serverUrl + '/')" >
        <div class="iconlinkswrap" v-if="iconLinks">
            <img class="iconlink" v-for="icon in iconLinks" @click.stop="redirect(icon[0])" :src="WEBSITES_URL + icon[1]" :alt="icon[2]">
        </div>
        <img class="servericon" :src="THUMB_URL + thumbnailName">
        <div class="serverdeath">
            <img class="deathicon" :src="THUMB_URL + ((death) ? 'death.png' : 'online.png')">
            <span v-if="death" class="deathtext">{{ ' ' + death }}</span>
            <span v-else class="onlinetext">{{ ' ' + (message ? message : "Online") }}</span>
            <img class="flagicon" :src="FLAG_URL + country + '.png'">
        </div>
        <button v-text="serverName" />
    </div>
</template>

<style scoped>
    .iconlinkswrap {
        position: absolute;
        margin-top: 140px;
        margin-left: v-bind("marginLeft");
        /* Could just invert when I define the objects lmao */
        display: flex;
        flex-direction: row-reverse;
    }
    .iconlink {
        width: 50px;
        background: #131313;
        border-radius: 10px;
        padding: 5px;
        cursor: pointer;
        margin-right: 5px;
    }
    .serverentry {
        margin: 20px;
        padding: 10px;
        /* border: 1px solid #000000; */
        background: rgba(0, 0, 0, 0.195);
        width: fit-content;
        border-radius: 15px;
        cursor: pointer;
    }
    .servericon {
        max-width: 200px;
        max-height: 200px;
        border-radius: 20px;
    }
    button {
        font-size: 250%;
        background: rgb(214,214,214);
        border-radius: 15px;
        padding: 8px;
        border: transparent;
        margin-top: 10px;
        width: 100%;
    }
    button:hover {
        cursor: pointer;
    }
    .serverdeath {
        background: rgba(0, 0, 0, 0.302);
        border-radius: 5px;
        height: 26px;
    }
    .deathicon {
        top: 5px;
        transform: translateY(2px); /* Annoying image being 2px offcenter */
        margin-right: 2px;
        margin-left: 3px;
    }
    .deathtext {
        color: #ff5353;
        font-weight: bold;
    }
    .onlinetext {
        color: #82f880;
        font-weight: bold;
    }

    .flagicon {
        float: right;
        margin-right: 5px;
        transform: translateY(3px); /* Annoying image being 2px offcenter */
        border-radius: 50px;
    }
</style>