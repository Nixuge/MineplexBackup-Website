<script setup lang="ts">
import { ServerMap } from '@/ts/server/ServerMap';
import { setCurrentMap } from '@/ts/manager/CurrentMap';

defineProps<{
  map: ServerMap;
}>()
</script>

<template>
    <div class="grid_element fade" @click="setCurrentMap(map);">
        <img :src="map.getPreviewUrl()">
        <p>{{ map.mapName }}</p> 
    </div>
</template>

<style scoped>
/* Kinda dirty fix, but for some reason can't remove a margin on top */
p {
    margin: 0;
    transform: translateY(-2px);
}
.grid_element {
    padding-bottom: 0px;
    transition: cubic-bezier(0.075, 0.82, 0.165, 1) .2s;
    border-radius: 10px;
    text-align: center;
    width: 95%;
    background-color: rgba(0, 0, 0, 0.174);
    padding: 5px 5px 0 5px;
}
.grid_element:hover {
    cursor: pointer;
    transform: scale(1.02);
}

img {
    border-radius: 10px;
    width: 100%;
    height: 100%;
}
</style>