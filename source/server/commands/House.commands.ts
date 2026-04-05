import { RAGERP } from "@api";
import { House } from "@classes/House.class";
import { RageShared } from "@shared/index";



RAGERP.commands.add({
    name: "createhouse",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_FOUR,
    run: async (player: PlayerMp, _, price: string) => {
        if (!_ || !price.length) return RAGERP.chat.sendSyntaxError(player, "/createhouse [price]");

        const housePrice = parseInt(price);
        if (isNaN(housePrice)) return player.showNotify(RageShared.Enums.NotifyType.TYPE_ERROR, "Invalid price.");

        // We create an offset of 1 meter on the X axis as a "dummy" exit so the player sees a teleport happen.
        const defaultExit = new mp.Vector3(player.position.x + 1, player.position.y, player.position.z);
        const house = await House.create(player.position, defaultExit, housePrice, 0, "State", 0);

        if (!house) return player.outputChatBox("Error creating house");
        player.outputChatBox(`House created with id ${house.houseId}`);
        player.outputChatBox(`Now go inside a villa and type: /sethouseexit ${house.houseId}`);
    }
});

RAGERP.commands.add({
    name: "sethouseexit",
    aliases: ["sethexit"],
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_FOUR,
    run: async (player: PlayerMp, args: [string]) => {
        const houseId = parseInt(args[0]);
        if (isNaN(houseId)) return player.outputChatBox("Usage: /sethouseexit [houseId]");

        const house = House.getHouse(houseId);
        if (!house) return player.outputChatBox("House not found.");

        house.updateExit(player.position);
        await house.save();
        player.outputChatBox(`Successfully set EXIT for house ${houseId} at your current position.`);
    }
});

RAGERP.commands.add({
    name: "deletehouse",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_FOUR,
    run: async (player: PlayerMp, args: [string]) => {
        const houseId = parseInt(args[0]);
        if (isNaN(houseId)) return player.outputChatBox("Invalid house ID.");

        const house = House.getHouse(houseId);
        if (!house) return player.outputChatBox("House not found.");

        await House.destroy(houseId);
        player.outputChatBox(`House with id ${houseId} has been deleted.`);
    }
});

RAGERP.commands.add({
    name: "sethouseenter",
    aliases: ["sethenter"],
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_FOUR,
    run: async (player: PlayerMp, args: [string]) => {
        const houseId = parseInt(args[0]);
        if (isNaN(houseId)) return player.outputChatBox("Usage: /sethouseenter [houseId]");

        const house = House.getHouse(houseId);
        if (!house) return player.outputChatBox("House not found.");

        house.updateEnter(player.position);
        await house.save();
        player.outputChatBox(`Successfully set ENTRANCE for house ${houseId} at your current position.`);
    }
});

RAGERP.commands.add({
    name: "gotohouse",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_FOUR,
    run: (player: PlayerMp, args: [string]) => {
        const houseId = parseInt(args[0]);
        if (isNaN(houseId)) return player.outputChatBox("Invalid house ID.");

        const house = House.getHouse(houseId);
        if (!house) return player.outputChatBox("House not found.");

        player.position = house.enterPosition;
        player.dimension = house.dimension;
        player.outputChatBox(`Teleported to house with id ${houseId}.`);
    }
});

RAGERP.commands.add({
    name: "alockhouse",
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_FOUR,
    run: (player: PlayerMp, args: [string]) => {
        const houseId = parseInt(args[0]);
        if (isNaN(houseId)) return RAGERP.chat.sendSyntaxError(player, "Usage: /alockhouse [houseId]");

        const house = House.getHouse(houseId);
        if (!house) return player.outputChatBox("House not found.");

        house.toggleLock();
        player.outputChatBox(`House with id ${houseId} is now ${house.locked ? "locked" : "unlocked"}.`);
    }
});

RAGERP.commands.add({
    name: 'asellhouse',
    adminlevel: RageShared.Enums.ADMIN_LEVELS.LEVEL_FOUR,
    run: async (player: PlayerMp, args: [string]) => {
        const houseId = parseInt(args[0]);
        if (isNaN(houseId)) return player.outputChatBox("Invalid house ID.");

        const house = House.getHouse(houseId);
        if (!house) return player.outputChatBox("House not found.");

        house.owner = -1;
        house.ownerName = "State";

        await house.save();
        player.outputChatBox(`House with id ${houseId} has been sold.`);
    }
})