import { sanitize } from "@/ts/utils/TextUtils";
import { Tag, TagNode } from "@/ts/data/Tag";

export class TagsManager {
    public static getNewTags(search: string) {
        let tagNode = new TagNode();

        if (!search.includes(":")) {
            tagNode.addRemaining(sanitize(search));
            return tagNode;
        }

        const parts = search.split(" ");

        for (const part of parts) {
            if (!part.includes(":")) {
                tagNode.addRemaining(part);
                continue;
            }
            const splittedTag = part.split(":");
            tagNode.addTag(
                new Tag(sanitize(splittedTag[0]), sanitize(splittedTag[1]))
            );
        }

        // tagNode.getTags().forEach(element => {
        //     console.log(element.type.toString() + " of val " + element.value);
        // });
        // console.log("remaining: " + tagNode.getRemaining());
        
        return tagNode;
    }
}