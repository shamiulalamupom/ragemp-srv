import { RAGERP } from "@api";
import { inventorydataPresset } from "@modules/inventory/Assets.module";
import { RageShared } from "@shared/index";
import { NativeMenu } from "@classes/NativeMenu.class";
import { House } from "@classes/House.class";
import { CharacterEntity } from "@entities/Character.entity";

RAGERP.commands.add({
    name: "gotopos",
    description: "Teleport to a x y z",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: (player: PlayerMp, fulltext: string, x: string, y: string, z: string) => {
        if (!fulltext.length || !x.length || !y.length || !z.length) return player.outputChatBox("Usage: /gotopos [x] [y] [z]");

        player.position = new mp.Vector3(parseFloat(x), parseFloat(y), parseFloat(z));
    }
});

RAGERP.commands.add({
    name: "savepos",
    aliases: ["getpos", "mypos"],
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: (player: PlayerMp) => {
        const [{ x, y, z }, heading] = [player.position, player.heading];
        console.log(`Position: new mp.Vector3(${x}, ${y}, ${z})`);
        console.log(`Heading: ${heading}`);
    }
});

RAGERP.commands.add({
    name: "settime",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: (player: PlayerMp, fulltext: string, time: string) => {
        mp.world.time.set(parseInt(time), 0, 0);
    }
});

RAGERP.commands.add({
    name: "sethealth",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: (player: PlayerMp, fulltext, health) => {
        player.health = parseInt(health);
    }
});

RAGERP.commands.add({
    name: "clearinventory",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: (player: PlayerMp, fulltext: string, targetid: string) => {
        if (!targetid.length) return RAGERP.chat.sendSyntaxError(player, "/clearinventory [playerid]");

        let target = mp.players.at(parseInt(targetid));
        if (!target || !mp.players.exists(target) || !target.character || !target.character.inventory) return;

        target.character.inventory.items = {
            pockets: inventorydataPresset.pockets,
            clothes: inventorydataPresset.clothes
        };
        target.character.inventory.quickUse = inventorydataPresset.quickUse;
        target.character.inventory.reloadClothes(target);
    }
});

RAGERP.commands.add({
    name: "setpage",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: (player: PlayerMp, fulltext, pagename) => {
        RAGERP.cef.emit(player, "system", "setPage", pagename);
    }
});

RAGERP.commands.add({
    name: "reloadclientside",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: (player: PlayerMp) => {
        //@ts-ignore
        mp.players.reloadResources();
    }
});
RAGERP.commands.add({
    name: "testbbb",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: (player: PlayerMp) => {
        //@ts-ignore
        player.call("testcambro");
    }
});

RAGERP.commands.add({
    name: "testnativemenu",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: async (player: PlayerMp) => {
        player.nativemenu = new NativeMenu(player, 0, "Hello World", "This is a description", [
            { name: "test", type: RageShared.Enums.NATIVEMENU_TYPES.TYPE_DEFAULT, uid: 123 },
            { name: "test 2", type: RageShared.Enums.NATIVEMENU_TYPES.TYPE_DEFAULT, uid: 1232 },
            { name: "test 3", type: RageShared.Enums.NATIVEMENU_TYPES.TYPE_DEFAULT, uid: 1232 }
        ]);

        player.nativemenu.onItemSelected(player).then((res) => {
            if (!res) return player.nativemenu?.destroy(player);
            const data = RAGERP.utils.parseObject(res);
            console.log("onItemSelected called, with result: ", data);

            switch (data.listitem) {
                case 0: {
                    console.log("player selected the first item in native menu");
                    return;
                }
                default: {
                    return console.log(`player selected index ${data.listitem} | name: ${data.name} | uid: ${data.uid}`);
                }
            }
        });
    }
});

RAGERP.commands.add({
    name: "testitem",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: async (player: PlayerMp) => {
        if (!player.character || !player.character.inventory) return;

        const items = player.character.inventory.getItemsInCategoryByType([RageShared.Inventory.Enums.INVENTORY_CATEGORIES.POCKETS], RageShared.Inventory.Enums.ITEM_TYPES.ITEM_TYPE_PISTOL);
        if (!items.length) return;
        player.character.inventory.startUsingItem(
            player,
            "Press ESC to cancel this action",
            5,
            {
                item: items[0],
                animDict: "mini@repair",
                animName: "fixing_a_player",
                flag: 16,
                attachObject: "item_toolbox"
            },
            async () => {
                console.log("Hello world!");
            }
        );
    }
});

RAGERP.commands.add({
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    name: "testattach",
    run: (player: PlayerMp, fullText: string, item: string, isAttach: string) => {
        player.attachObject(item, parseInt(isAttach) !== 0);
    }
});

RAGERP.commands.add({
    name: "setpopulation",
    description: "Set ambient population density (0.0 - 1.0)",
    adminlevel: 0,
    run: (player: PlayerMp, fulltext: string, density: string) => {
        const value = parseFloat(density);
        if (isNaN(value)) return player.outputChatBox("Usage: /setpopulation [0.0 - 1.0]");
        
        mp.players.call("client::population:setDensity", [value]);
        player.outputChatBox(`Ambient population density set to ${value} for all players.`);
    }
});

RAGERP.commands.add({
    name: "beadmin",
    description: "Sets your admin level to 6 (Dev only)",
    adminlevel: 0,
    run: async (player: PlayerMp) => {
        if (!player.character) return player.outputChatBox("You must be logged in to a character.");
        player.character.adminlevel = 6;
        player.setVariable("adminLevel", 6);
        //@ts-ignore
        await RAGERP.database.getRepository(CharacterEntity).update(player.character.id, { adminlevel: 6 });
        player.outputChatBox("!{green}You are now a Level 6 Admin!");
        RAGERP.commands.reloadCommands(player);
    }
});
RAGERP.commands.add({
    name: "villas",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: (player: PlayerMp) => {
        player.outputChatBox("--- Iconic Villas ---");
        player.outputChatBox("/villa franklin - Franklin's Mansion");
        player.outputChatBox("/villa michael - Michael's House");
        player.outputChatBox("/villa trevor - Trevor's Trailer");
        player.outputChatBox("/villa eclipse - Eclipse Towers Penthouse");
        player.outputChatBox("/villa stilt - Vinewood Stilt House");
        player.outputChatBox("/villa casino - Diamond Casino Penthouse");
        player.outputChatBox("/villa yacht - Luxury Yacht");
    }
});

RAGERP.commands.add({
    name: "villa",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_SIX,
    run: (player: PlayerMp, fulltext: string, type: string) => {
        if (!type) return player.outputChatBox("Usage: /villa [name]");

        switch (type.toLowerCase()) {
            case "franklin":
                player.position = new mp.Vector3(7.61, 538.21, 176.02);
                break;
            case "michael":
                player.position = new mp.Vector3(-802.31, 175.04, 72.84);
                break;
            case "trevor":
                player.position = new mp.Vector3(1974.16, 3819.04, 33.42);
                break;
            case "eclipse":
                player.position = new mp.Vector3(-285.50, -720.0, 121.0); // Eclipse Towers
                player.call("client::player:freeze", [true]);
                setTimeout(() => player.call("client::player:freeze", [false]), 3000);
                break;
            case "stilt":
                player.position = new mp.Vector3(-169.0, 486.0, 137.0); // Vinewood Hills
                player.call("client::player:freeze", [true]);
                setTimeout(() => player.call("client::player:freeze", [false]), 3000);
                break;
            case "yacht":
                player.position = new mp.Vector3(-2022.0, -1038.0, 6.0); // The Yacht
                break;
            case "casino":
                player.position = new mp.Vector3(976.6, 70.3, 115.2);
                player.call("client::player:freeze", [true]);
                setTimeout(() => player.call("client::player:freeze", [false]), 5000); // 5 seconds for safety!
                break;
            default:
                player.outputChatBox("Unknown location. Use /villas to see the list.");
        }
    }
});

RAGERP.commands.add({
    name: "freeze",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_ONE,
    run: (player: PlayerMp, fulltext: string, target: string, toggle: string) => {
        if (!target) return player.outputChatBox("Usage: /freeze [target] [1/0]");
        const targetPlayer = mp.players.at(parseInt(target));
        if (!targetPlayer) return;

        const isFrozen = toggle === "1";
        targetPlayer.call("client::player:freeze", [isFrozen]);
        player.outputChatBox(`${targetPlayer.name} is now ${isFrozen ? "frozen" : "unfrozen"}.`);
    }
});
