import Skyblock from "BloomCore/Skyblock"
let { SettingSelector, SettingSlider, SettingToggle, ConfigModuleClass, ModuleToggle, getKeyBind, ModuleManager } = global.settingSelection
let { ChatUtils, MathUtils, MouseUtils, Vec3, RaytraceUtils, PowderRotations, Rotations, MovementHelper, TimeHelper, RenderUtils, Vector, FailSafeUtils, Utils, MiningUtils, ItemUtils, KeyBinding } = global.export

global.modules.push(
    new ConfigModuleClass(
        "Powder Macro",
        "Mining",
        [
            new SettingSlider("Rotation Time", 500, 50, 1000)
        ],
        [
            "Mines hardstone and opens powder chests in the Crystal Hollows"
        ]
    )
)

class PowderMacro {
    constructor() {
        this.Enabled = false
        this.ModuleName = "Powder Macro"
        this.mc = Client.getMinecraft()
        getKeyBind("Powder Macro", "Polar Client - Mining", this)

        register("command", () => {
            this.toggle()
        }).setName("powder", true)

        this.MACROSTATES = {
            WAITING: 0,
            MINING: 1,
            TREASURE_WALK: 2,
            TREASURE_SOLVE: 3,
            ROTATING: 4,
            UNSTUCK: 5,
            UNSTUCKGEMSTONE: 6,
            UNSTUCKHARDSTONE: 7,
            UNSTUCKMAGICALFORCE: 8,
            UNSTUCKAIR: 9,
            SETUPAOTV: 10,
            MINEDOWN: 11,
            UNSTUCKGEMSTONERESET: 12
        }

        this.state = this.MACROSTATES.WAITING;
        this.previousState = this.MACROSTATES.WAITING;
        this.phase = 0
        this.mineLow = true
        this.direction = 0
        this.rotation = new RotationData(this.direction, 0, 20, 20, 1000)
        this.chests = new Map()
        this.opened = new Map()
        this.targetChest = null
        this.chestCooldown = new TimeHelper()
        this.particleSpawned = false
        this.particleLooked = false
        this.walkable = [1, 14, 15, 16, 21, 56, 73, 74, 129]
        this.obstacle = [95, 160, 168, 35, 159]
        this.obstructCooldown = new TimeHelper()
        this.chestTimer = new TimeHelper()
        this.rotate = false
        this.turnCooldown = new TimeHelper()
        this.greatExplorerLvl20 = false
        this.greatExplorerCooldown = new TimeHelper()
        this.greatExplorerTime = 100
        this.walkTimer = new TimeHelper()
        this.miningItem = null
        this.powderDrill = null
        this.aotv = null
        this.stuckTimer = new TimeHelper()
        this.lastPosition = null
        this.hardstoneTimer = new TimeHelper()
        this.hardstoneRotations = 0

        this.targetGemstones = []
        this.previousGemstone = null
        this.gemstoneTimeout = new TimeHelper()

        this.magicalTimer = new TimeHelper()

        this.airTimer = new TimeHelper()
        this.airRotations = 0
        this.targetY = 0

        this.particle = null
        this.clickedChest = false

        this.pauseMacro = false;
        this.directionVector = new Vector(0, 0, 0);
        this.shiftTimer = new TimeHelper();
        this.moveleft = false;
        this.updateDirectionVector = false;
        this.tickCounter = 0;

        register("tick", () => {

            if(!this.Enabled) return

            if(Client.currentGui.getClassName() != "null") {
                MovementHelper.stopMovement();
                PowderRotations.stop();
                if(!this.pauseMacro) this.previousState = this.state
                this.pauseMacro = true;
                this.state = this.MACROSTATES.WAITING;
                return;
            }

            if(this.pauseMacro) {
                this.state = this.previousState;
                this.pauseMacro = false;
                this.greatExplorerCooldown.reset();
                this.lastPosition = new Vector(Player.getPlayer());
                this.stuckTimer.reset();
                this.airRotations = 0;
                this.hardstoneRotations = 0;
                this.airTimer.reset();
                this.particle = null;
                this.rotation = new RotationData(this.direction, 10, 35, 10, 600);
            }

            this.updateState()

            switch(this.state) {
                case this.MACROSTATES.MINING:
                    ItemUtils.setItemSlot(this.miningItem.slot);

                    MovementHelper.setKey("shift", !this.isAirInFrond() && this.shiftTimer.reachedRandom());
                    MovementHelper.setKey("leftclick", true);

                    if(this.airTimer.hasReached(20000)) {
                        if(this.airRotations > 0) this.airRotations--
                        if(this.hardstoneRotations > 0) this.hardstoneRotations--
                        this.airTimer.reset()
                    }

                    this.tickCounter++;
                    if(this.walkTimer.hasReached(100)) {
                        let obstruction = this.getLaneObstruction(5.0)
                        MovementHelper.setKey("s", this.canMoveBack(1.5))
                        if(!obstruction) {
                            MovementHelper.setKey("w", this.canMove(3.0))
                        }
                        if(obstruction) {
                            let lane = this.getLaneDirection(5, obstruction);
                            MovementHelper.setKey("a", lane.key === "a");
                            MovementHelper.setKey("d", lane.key === "d");
                            MovementHelper.setKey("w", this.canMove(2.5));
                            this.moveleft = lane.key === "a" ? true : false;
                            this.updateDirectionVector = true;
                            this.tickCounter = 0;
                        } else if(PowderRotations.rotate && PowderRotations.smoothedToStart) {
                            if(this.updateDirectionVector) {
                                this.directionVector = new Vector(Player.getX(), Player.getY(), Player.getZ());
                                this.updateDirectionVector = false;
                            }
                            let result = this.movingDirection(this.directionVector);
                            MovementHelper.setKey("a", result.a && this.tickCounter >= 60);
                            MovementHelper.setKey("d", result.d && this.tickCounter >= 60);
                        }
                        this.walkTimer.reset()
                    }

                    if(!PowderRotations.rotate) PowderRotations.start(this.direction);

                    break
                case this.MACROSTATES.TREASURE_WALK:
                    ItemUtils.setItemSlot(this.powderDrill.slot)
                    const centerChest = new Vec3(this.targetChest.x + 0.5, this.targetChest.y + 0.5, this.targetChest.z + 0.5)
                    const angleChest = MathUtils.calculateAngles(centerChest).yaw
                    if(!Rotations.rotate) Rotations.rotateTo(centerChest)
                    MovementHelper.setKey("shift", this.greatExplorerLvl20)
                    MovementHelper.setKeysBasedOnYawTemp(angleChest, false)

                    break
                case this.MACROSTATES.TREASURE_SOLVE:
                    ItemUtils.setItemSlot(this.powderDrill.slot)
                    const centerChestVec3 = new Vec3(this.targetChest.x + 0.5, this.targetChest.y + 0.5, this.targetChest.z + 0.5)
                    const distanceChest = MathUtils.getDistanceToPlayer(centerChestVec3)
                    if(this.walkTimer.hasReached(100)) {
                        MovementHelper.setKey("s", distanceChest.distance < 3.0 && distanceChest.distanceFlat < 1.5)
                        MovementHelper.setKey("w", distanceChest.distance > 4.0 && distanceChest.distanceFlat > 1.0)
                        this.walkTimer.reset()
                    }
                    MovementHelper.setKey("shift", this.greatExplorerLvl20);

                    if(!this.particleSpawned && !Rotations.rotate) Rotations.rotateTo(centerChestVec3)

                    if(this.particle) {
                        let angles = MathUtils.calculateAngles(this.particle)
                        if(Math.abs(angles.yaw) + Math.abs(angles.pitch) < 3.0) {
                            Rotations.stopRotate()
                        }
                    }

                    break
                case this.MACROSTATES.UNSTUCKGEMSTONE:
                    if(this.gemstoneTimeout.hasReached(300)) {
                        this.gemstoneTimeout.reset();
                        let closest = null
                        let lowest = 0
                        this.targetGemstones.filter(function(pos) {
                            let id = World.getBlockAt(pos).type.getID()
                            return (id === 95.0 || id === 160.0 || id === 168.0 || id === 3.0)
                        }).forEach((pos) => {
                            let distance = MathUtils.getDistanceToPlayer(pos)
                            if(!closest || distance < lowest) {
                                closest = pos
                                lowest = distance
                            }
                        })

                        if(!closest) {
                            this.state = this.MACROSTATES.MINING
                            this.stuckTimer.reset()
                            this.lastPosition = new Vector(Player.getPlayer())
                            return
                        }

                        if(this.previousGemstone != closest.toString() && !Rotations.rotate) Rotations.rotateTo(new Vector(closest).add(0.5, 0.5, 0.5), 5.0)
                        this.previousGemstone = closest.toString()
                        MovementHelper.setKey("leftclick", true)

                        let block = Player.lookingAt();
                        if(block instanceof Block) {
                            if(block.pos.equals(closest) && !Client.getMinecraft().field_71442_b.func_181040_m()) {
                                Client.getMinecraft().field_71415_G = true;
                                ItemUtils.leftClick();
                            }
                        }
                    }

                    break
                case this.MACROSTATES.UNSTUCKHARDSTONE:
                    if(this.hardstoneRotations === 4.0) {
                        this.rotate = true
                        this.state = this.MACROSTATES.ROTATING
                        break
                    }
                    MovementHelper.setKey("leftclick", false)
                    if(!this.hardstoneTimer.reachedRandom()) {
                        MovementHelper.setKey("s", true)
                        MovementHelper.setKey("shift", true)
                    } else {
                        MovementHelper.stopMovement()
                        this.state = this.MACROSTATES.MINING
                        this.stuckTimer.reset()
                        this.lastPosition = new Vector(Player.getPlayer())
                        MovementHelper.setKey("leftclick", true)
                    }

                    break
                case this.MACROSTATES.UNSTUCKMAGICALFORCE:

                    if(!this.magicalTimer.hasReached(400)) {
                        MovementHelper.setKey("shift", false)
                        MovementHelper.setKey("s", true)
                    } else {
                        this.rotate = true
                        this.state = this.MACROSTATES.ROTATING
                    }

                    break
                case this.MACROSTATES.SETUPAOTV:
                    this.state = this.MACROSTATES.WAITING
                    MovementHelper.setKey("leftclick", false)
                    Player.setHeldItemIndex(this.aotv.slot);
                    Rotations.rotateToAngles(this.direction, 86.0, 5.0)
                    Rotations.onEndRotation(() => {
                        ItemUtils.rightClick(3)
                        Client.scheduleTask(15, () => {
                            ItemUtils.setItemSlot(this.miningItem.slot)
                        })
                        Client.scheduleTask(20, () => {
                            this.state = this.MACROSTATES.MINEDOWN
                            MovementHelper.stopMovement()
                            Client.getMinecraft().field_71415_G = true;
                            KeyBinding.func_74507_a(Client.getMinecraft().field_71474_y.field_74312_F.func_151463_i());
                            MovementHelper.setKey("leftclick", true)
                            this.airTimer.reset()
                        })
                    })
                    break
                case this.MACROSTATES.MINEDOWN:
                    MovementHelper.setKey("leftclick", true)
                    if(Math.round(Player.getY()-1) === this.targetY || this.airTimer.hasReached(10000)) {
                        this.state = this.MACROSTATES.MINING
                        this.lastPosition = new Vector(Player.getPlayer())
                        this.stuckTimer.reset()
                        this.airTimer.reset()
                        this.airRotations = 0
                    }
                    break
                default:
                    break
            }
        })

        register("renderWorld", () => {

            if(!this.Enabled) return

            if(this.state === this.MACROSTATES.TREASURE_SOLVE || this.state === this.MACROSTATES.TREASURE_WALK) {
                if(this.greatExplorerLvl20 && this.canClickChest() && this.greatExplorerCooldown.hasReached(this.greatExplorerTime)) {
                    ItemUtils.rightClick()
                    this.greatExplorerCooldown.reset()
                    this.greatExplorerTime = 500
                }
                MovementHelper.setKey("leftclick", this.canMineDuringChest())
            }
        })

        register("chat", (message) => {
            if(!this.Enabled || this.state != this.MACROSTATES.TREASURE_SOLVE) return
            if(!this.targetChest) return
            if((this.clickedChest || !this.greatExplorerLvl20) && (ChatLib.getChatMessage(message, false).startsWith("You have successfully picked the lock on this chest!") || ChatLib.getChatMessage(message, false).startsWith("You received "))) {
                this.state = this.MACROSTATES.MINING
                this.lastPosition = new Vector(Player.getPlayer())
                this.stuckTimer.reset()
                this.greatExplorerCooldown.reset()
                Rotations.stopRotate()
                if(Math.random() > 0.6) PowderRotations.clockWise = !PowderRotations.clockWise;
                this.shiftTimer.reset();
                this.shiftTimer.setRandomReached(300, 600);
                this.clearTargetChest()
            }
        })

        register("chat", (message) => {
            if(!this.Enabled || this.state != this.MACROSTATES.MINING) return
            let msg = ChatLib.getChatMessage(message, false)
            if(msg.startsWith("A magical force surrounding this area prevents you from breaking blocks!") || msg.startsWith("You cannot mine this close to an entrance!")) {
                PowderRotations.stop();
                this.state = this.MACROSTATES.WAITING;
                MovementHelper.stopMovement();
                Rotations.rotateToAngles(this.direction, 0.0, 5.0);
                Rotations.onEndRotation(() => {
                    this.magicalTimer.reset();
                    this.state = this.MACROSTATES.UNSTUCKMAGICALFORCE;
                    global.export.SmartFailsafe.triggered = false;
                    MovementHelper.stopMovement();
                })
            }
        })

        register("packetReceived", (Packet, Event) => {
            if(!this.Enabled || (this.state != this.MACROSTATES.TREASURE_SOLVE && this.state != this.MACROSTATES.TREASURE_WALK)) return
            if(!this.targetChest) return
            let x = Packet.func_149220_d()
            let y = Packet.func_149226_e()
            let z = Packet.func_149225_f()
            if(Packet.func_179749_a().toString() === "CRIT" && Math.abs(x - (this.targetChest.x + 0.5)) < 0.7 && Math.abs(y - (this.targetChest.y + 0.5)) < 0.7 && Math.abs(z - (this.targetChest.z + 0.5)) < 0.7) {
                this.particleSpawned = true
                let angleParticle = MathUtils.angleToPlayer([x,y,z]).distance
                if(angleParticle < 40) {
                    this.particleLooked = true
                    this.particle = new Vector(x,y,z)
                    Rotations.rotateTo(this.particle, 5.0)
                    this.chestTimer.reset();
                }
            }
        }).setFilteredClasses([net.minecraft.network.play.server.S2APacketParticles])

        register("packetReceived", (Packet, Event) => {
            if(!this.Enabled) return

            if(Packet instanceof net.minecraft.network.play.server.S22PacketMultiBlockChange) {
                Packet.func_179844_a().forEach((data) => {
                    let pos = new BlockPos(data.func_180090_a())
                    let hash = pos.hashCode()
                    let calc = MathUtils.getDistanceToPlayer(pos)
                    if(data.func_180088_c().toString().includes("chest") && calc.distance < 8.0 && pos.y - Player.getY() <= 3.0) {
                        if(!this.opened.has(hash) && !this.chests.has(hash)) {
                            this.chestCooldown.reset()
                            this.chests.set(hash, pos)
                        }
                    }
                })
            }
            if(Packet instanceof net.minecraft.network.play.server.S23PacketBlockChange) {
                let pos = new BlockPos(Packet.func_179827_b())
                let hash = pos.hashCode()
                let calc = MathUtils.getDistanceToPlayer(pos)
                if(Packet.func_180728_a().toString().includes("chest") && calc.distance < 8.0 && pos.y - Player.getY() <= 3.0) {
                    if(!this.opened.has(hash) && !this.chests.has(hash)) {
                        this.chestCooldown.reset()
                        this.chests.set(hash, pos)
                    }
                }
            }
        })

        this.cancelledBlocks = []
        register("packetSent", (Packet, Event) => {
            let pos = new BlockPos(Packet.func_179715_a());
            if(this.Enabled && Math.floor(Player.getY() - 1) === pos.y && this.walkable.indexOf(World.getBlockAt(pos).type.getID()) != -1 && this.state != this.MACROSTATES.MINEDOWN) {
                Event.setCanceled(true);
            }
        }).setFilteredClasses([net.minecraft.network.play.client.C07PacketPlayerDigging])

        register("packetSent", (Packet, Event) => {
            if(!this.Enabled) return
            if(!this.targetChest) return
            let pos = new BlockPos(Packet.func_179724_a())
            if(pos.x === this.targetChest.x && pos.y === this.targetChest.y && pos.z === this.targetChest.z) {
                this.clickedChest = true
            }
        }).setFilteredClass(net.minecraft.network.play.client.C08PacketPlayerBlockPlacement)

        register("renderWorld", () => {
            if(this.Enabled && this.targetChest) {
                RenderUtils.renderCube([this.targetChest.x, this.targetChest.y, this.targetChest.z], [0,0,1], true, 0.2)
            }
        })

        register("worldUnload", () => {
            if(this.Enabled) this.toggle()
        })
    }

    toggle() {
        this.Enabled = !this.Enabled
        this.sendMacroMessage(this.Enabled ? "&aEnabled": "&cDisabled")
        if(this.Enabled) {
            if(Skyblock.area != "Crystal Hollows") {
                this.stopMacro("Be in the Crystal Hollows", true)
                return
            }
            MouseUtils.unGrabMouse()
            let items = MiningUtils.getPowderItems()
            this.miningItem = items.hardStone
            this.powderDrill = items.powderDrill
            this.aotv = Utils.getItemByName("Aspect of the")
            if(!this.powderDrill) this.powderDrill = this.miningItem
            if(!this.miningItem) {
                this.stopMacro("Missing an item that can mine gemstones (for anti stuck)", true)
                return
            }
            if(!this.aotv) {
                this.stopMacro("Missing an Aspect of the End/Void", true)
                return
            }

            this.state = this.MACROSTATES.WAITING
            this.chests.clear()
            this.opened.clear()
            this.targetChest = null
            RaytraceUtils.setSides([
                [0.08, 0.5, 0.5],
                [0.92, 0.5, 0.5],
                [0.5, 0.5, 0.08],
                [0.5, 0.5, 0.92],
                [0.5, 0.12, 0.5],
                [0.5, 0.88, 0.5]
            ])
            MiningUtils.startGreatExplorer()
            MiningUtils.onGreatExplorerDone((lvl20) => {
                this.greatExplorerLvl20 = lvl20
                Rotations.roundToAngles(Player.getYaw())
                Rotations.onEndRotation(() => {
                    Client.scheduleTask(10, () => {
                        this.greatExplorerCooldown.reset()
                        let playerYaw = Player.getPlayer().field_70177_z
                        this.direction = Math.round(playerYaw)
                        this.directionVector = new Vector(Player.getX(), Player.getY(), Player.getZ());
                        this.lastPosition = new Vector(Player.getPlayer())
                        this.stuckTimer.reset()
                        this.airRotations = 0
                        this.hardstoneRotations = 0
                        this.airTimer.reset()
                        this.particle = null
                        this.rotation = new RotationData(this.direction, 10, 35, 10, 600)
                        this.state = this.MACROSTATES.MINING

                        // Failsafes
                        global.export.FailsafeManager.register((cb) => {
                            if (this.Enabled) this.toggle()
                            cb()
                        }, () => {
                            if (!this.Enabled) this.toggle()
                        }, ["Teleport", "Rotation", "Velocity", "Item", "Player", "Smart"])
                    })
                })
            })
        }
        if(!this.Enabled) {
            this.stopMacro()
        }
    }

    updateState() {
        switch(this.state) {
            case this.MACROSTATES.MINING:
                if(this.chests.size > 0 && this.chestCooldown.hasReached(250)) {
                    this.chests.forEach((pos, hash) => {
                        if(MathUtils.distanceToPlayerPoint(pos).distance > 8.0) {
                            this.chests.delete(hash)
                            return
                        }
                        if(RaytraceUtils.getPointOnBlock(pos, Player.getPlayer().func_174824_e(1), true)) {
                            this.targetChest = pos
                            this.chestTimer.reset()
                            this.state = this.MACROSTATES.TREASURE_WALK
                            this.greatExplorerCooldown.reset()
                            PowderRotations.stop();
                            MovementHelper.stopMovement()
                        }
                    })
                }

                let obstruction = this.getObstruction(7)
                if(obstruction.result && this.turnCooldown.hasReached(1500)) {
                    if(obstruction.airObtruction) this.airRotations++
                    PowderRotations.stop();
                    this.rotate = true
                    this.state = this.MACROSTATES.ROTATING
                }

                if(this.stuckTimer.hasReached(4000) || global.export.SmartFailsafe.triggered) {
                    if(MathUtils.getDistanceToPlayer(this.lastPosition).distanceFlat < 2.0) {
                        let blocks = this.getBlocksAround()
                        let gemstones = []
                        let hardstone = []

                        blocks.forEach((id, pos) => {
                            if(id === 95.0 || id === 160.0 || id === 168.0 || id === 3.0) gemstones.push(pos)
                            if(this.walkable.indexOf(id) != -1) hardstone.push(pos)
                        })

                        if(gemstones.length > 0.0) {
                            PowderRotations.stop();
                            MovementHelper.stopMovement()
                            this.targetGemstones = gemstones
                            this.state = this.MACROSTATES.WAITING
                            Client.getMinecraft().field_71415_G = true;
                            MovementHelper.setKey("leftclick", true)
                            MovementHelper.setKey("shift", false)
                            this.gemstoneTimeout.reset()
                            this.state = this.MACROSTATES.UNSTUCKGEMSTONE
                            global.export.SmartFailsafe.triggered = false
                        } else if(hardstone.length > 0.0) {
                            this.hardstoneRotations++
                            PowderRotations.stop();
                            MovementHelper.stopMovement()
                            this.state = this.MACROSTATES.WAITING
                            Rotations.rotateToAngles(this.direction, 0.0, 3.0)
                            Rotations.onEndRotation(() => {
                                this.hardstoneTimer.reset();
                                this.hardstoneTimer.setRandomReached(400, 600);
                                this.state = this.MACROSTATES.UNSTUCKHARDSTONE;
                                global.export.SmartFailsafe.triggered = false
                            })
                        }
                    }
                    this.lastPosition = new Vector(Player.getPlayer())
                    this.stuckTimer.reset()
                }

                break
            case this.MACROSTATES.TREASURE_WALK:
                let chestPos = [this.targetChest.x + 0.5, this.targetChest.y + 0.5, this.targetChest.z + 0.5]
                if((MathUtils.distanceToPlayer(chestPos).distance < 3.0 && !this.greatExplorerLvl20) || ((this.canClickChest() || MathUtils.distanceToPlayer(chestPos).distance < 2.0) && this.greatExplorerLvl20) || this.particleSpawned) {
                    this.chestTimer.reset()
                    this.greatExplorerCooldown.reset()
                    this.state = this.MACROSTATES.TREASURE_SOLVE
                    this.clickedChest = false
                    this.greatExplorerTime = 100
                    MovementHelper.stopMovement()
                }
                if(World.getBlockAt(this.targetChest).type.getID() === 0.0 || this.chestTimer.hasReached(1500)) {
                    this.state = this.MACROSTATES.MINING
                    this.lastPosition = new Vector(Player.getPlayer())
                    this.stuckTimer.reset()
                    this.greatExplorerCooldown.reset()
                    this.clearTargetChest()
                }
                break
            case this.MACROSTATES.TREASURE_SOLVE:
                if(World.getBlockAt(this.targetChest).type.getID() === 0.0 || (this.chestTimer.hasReached(3000) || (this.greatExplorerLvl20 && this.chestTimer.hasReached(3000)))) {
                    this.state = this.MACROSTATES.MINING
                    this.lastPosition = new Vector(Player.getPlayer())
                    this.stuckTimer.reset()
                    this.greatExplorerCooldown.reset()
                    this.clearTargetChest()
                }
                break
            case this.MACROSTATES.ROTATING:
                MovementHelper.stopMovement()
                if(this.airRotations === 2.0 && this.isBlockUnderWalkeable(5)) {
                    this.targetY = Math.round(Player.getY()) - 5
                    this.state = this.MACROSTATES.SETUPAOTV
                } else if(this.rotate) {
                    this.rotate = false
                    let newDirection = this.direction + this.getNewDirection(12)
                    Rotations.rotateToAngles(newDirection, this.mineLow ? 10.0 : 0.0, 4.0)
                    Rotations.onEndRotation(() => {
                        this.greatExplorerCooldown.reset()
                        this.direction = newDirection
                        this.directionVector = new Vector(Player.getX(), Player.getY(), Player.getZ());
                        this.rotation = new RotationData(this.direction, 10, 35, 10, 600)
                        this.state = this.MACROSTATES.MINING
                        this.stuckTimer.reset()
                        this.turnCooldown.reset()
                        this.airTimer.reset()
                        Rotations.stopRotate()
                    })
                }
                break
            default:
                break
        }
    }

    /**
     *
     * @param {vec} vector
     */
    movingDirection(vector) {
        let trimmedDirection = this.direction % 360;
        let range = Math.random() * 0.75;
        if(trimmedDirection === 0) {
            if(this.moveleft) {
                //move left
                if(Player.getX() > vector.x + range) {
                    this.moveleft = false
                    return {a: false, d: true};
                }
                return {a: true, d: false};
            }
            if(!this.moveleft) {
                //move right
                if(Player.getX() < vector.x - range) {
                    this.moveleft = true;
                    return {a: true, d: false};
                }
                return {a: false, d: true};
            }
        }
        if(trimmedDirection === 180.0 || trimmedDirection === -180.0) {
            if(this.moveleft) {
                //move left
                if(Player.getX() < vector.x - range) {
                    this.moveleft = false
                    return {a: false, d: true};
                }
                return {a: true, d: false};
            }
            if(!this.moveleft) {
                //move right
                if(Player.getX() > vector.x + range) {
                    this.moveleft = true;
                    return {a: true, d: false};
                }
                return {a: false, d: true};
            }
        }
        if(trimmedDirection === 90.0 || trimmedDirection === -270) {
            if(this.moveleft) {
                //move left
                if(Player.getZ() > vector.z + range) {
                    this.moveleft = false
                    return {a: false, d: true};
                }
                return {a: true, d: false};
            }
            if(!this.moveleft) {
                //move right
                if(Player.getZ() < vector.z - range) {
                    this.moveleft = true;
                    return {a: true, d: false};
                }
                return {a: false, d: true};
            }
        }
        if(trimmedDirection === -90.0) {
            if(this.moveleft) {
                //move left
                if(Player.getZ() < vector.z - range) {
                    this.moveleft = false
                    return {a: false, d: true};
                }
                return {a: true, d: false};
            }
            if(!this.moveleft) {
                //move right
                if(Player.getZ() > vector.z + range) {
                    this.moveleft = true;
                    return {a: true, d: false};
                }
                return {a: false, d: true};
            }
        }
        return {a: false, d: false}
    }

    clearTargetChest() {
        let hash = this.targetChest.hashCode()
        this.chests.delete(hash)
        this.opened.set(hash, this.targetChest)
        this.targetChest = null
        this.particle = null
        this.particleSpawned = false
        this.particleLooked = false
    }

    canMove(radius) {
        let blocks = this.getBlocksFromAngle(10, false, false, true, true, this.direction)
        let walkScore = 0
        for(let key in blocks) {
            let found = false
            blocks[key].forEach((block, index) => {
                if(found) return
                if(block.type.getID() != 0.0 && block.type.getID() != 54.0) {
                    found = true
                    let pos = block.pos
                    if(MathUtils.distanceToPlayer([pos.x + 0.5, pos.y + 0.5, pos.z + 0.5]).distanceFlat > radius) {
                        walkScore++
                    }
                    return
                }
                if(index === blocks[key].length-1) {
                    walkScore++
                }
            })
        }
        return walkScore === 2
    }

    canMoveBack(radius) {
        let walk = false
        this.getBlocksFromAngle(10, false, false, true, false, this.direction).medium.forEach((block) => {
            if(block.type.getID() != 0.0) {
                let pos = block.pos
                if(MathUtils.distanceToPlayer([pos.x + 0.5, pos.y + 0.5, pos.z + 0.5]).distanceFlat < radius) {
                    walk = true
                }
            }
        })
        return walk
    }

    isAirInFrond() {
        let blocks = this.getBlocksFromAngle(1.0, false, true, false, false, this.direction).low
        for(let i = 0; i < blocks.length; i++) {
            let block = blocks[i]
            if(block.type.getID() === 0.0) {
                return true
            }
        }
        return false
    }

    canMine() {
        let object = Player.lookingAt()
        return (object instanceof Block && Math.round(object.getY()) != Math.round(Player.getY()-1))
    }

    canMineDuringChest() {
        let object = Player.lookingAt()
        if(object instanceof Block) {
            let blockId = object.type.getID()
            if(Math.round(object.getY()) != Math.round(Player.getY()-1) && blockId != 54 && this.walkable.indexOf(blockId) != -1) {
                return true
            }
        }
        return false
    }

    canClickChest() {
        let object = Player.lookingAt()
        if(object instanceof Block) {
            let id = object.type.getID()
            if(id === 54.0 || id === 146.0) {
                return true
            }
        }
        return false
    }

    isBlockUnderWalkeable(y) {
        if(Player.getY() - y < 64 && Player.getY() >= 64) {
            y = Player.getY() - 64
        }
        let id = World.getBlockAt(new Vector(Player.getPlayer()).getBlockPos().add(0,-y,0)).type.getID()
        return (this.walkable.indexOf(id) != -1 || this.obstacle.indexOf(id) != -1)
    }

    getObstruction(range) {
        let playerVec = new Vector(Player.getX(), Player.getY(), Player.getZ())
        let modulo = this.direction % 360
        let laneObstructions = 0
        let airObsturctions = 0
        let fluid = [8,9,10,11]
        let fluidObstructions = 0
        for(let width = -1; width <= 1; width++) {
            let vec = (modulo === 0.0 || modulo === 180.0 || modulo === -180.0) ? playerVec.add(width,0,0) : playerVec.add(0,0,width)
            let blocks = this.getBlocksFromAngle(range, false, true, true, true, this.direction, vec)
            let laneObstructed = false
            let airBlocks = 0
            let gemBlocks = 0
            let mithrilBlocks = 0
            for(let key in blocks) {
                blocks[key].forEach((block) => {
                    let blockId = block.type.getID()
                    if(blockId === 54) return
                    if(key != "low" && this.obstacle.indexOf(blockId) != -1) {
                        mithrilBlocks++
                        if(gemBlocks >= 2) laneObstructed = true
                        if(mithrilBlocks >= 5) laneObstructed = true
                    }
                    else if(key != "low" && this.walkable.indexOf(blockId) == -1 && blockId != 0) {
                        laneObstructed = true
                    }
                    else if(fluid.indexOf(blockId) != -1) {
                        fluidObstructions++;
                    }
                    else if(blockId === 0) {
                        airBlocks++
                    }
                })
            }
            if(laneObstructed || airBlocks > 14) laneObstructions++
            if(airBlocks > 14) airObsturctions++
        }
        return {result: laneObstructions >= 3 || fluidObstructions > 1, airObtruction: airObsturctions === 3}
    }

    /**
     * @returns {BlockPos}
     */
    getLaneObstruction(range) {
        const blocks = this.getBlocksFromAngle(range, false, true, true, true, this.direction)
        let obstruction = null
        let airBlocks = 0
        for(let key in blocks) {
            blocks[key].forEach((block) => {
                if(obstruction) return
                let blockId = block.type.getID()
                if((key === "low" && blockId === 0)) {
                    airBlocks += 1
                    if(airBlocks === 1) {
                        obstruction = block.pos
                    }
                }
                if(key != "low" && this.obstacle.indexOf(blockId) != -1) {
                    obstruction = block.pos
                }
                else if(key != "low" && this.walkable.indexOf(blockId) == -1 && blockId != 0 && blockId != 54) {
                    obstruction = block.pos
                }
            })
        }
        return obstruction
    }

    getLaneDirection(range, pos) {
        let left = 0
        let right = 0
        let position = new BlockPos(pos.x, Math.round(Player.getY()-1), pos.z)
        let modulo = this.direction % 360
        for(let depth = -1; depth <= 1; depth++) {
            if(depth === 0) continue
            for(let i = -range; i <= range; i++) {
                if(i === 0) continue
                let pos = (modulo === 0.0 || modulo === 180.0 || modulo === -180.0) ? position.add(new Vec3i(i,0,depth)) : position.add(new Vec3i(depth,0,i))
                for(let y = 0; y <= 2; y++) {
                    let blockId = World.getBlockAt(pos.add(0,y,0)).type.getID()
                    let cost = 0
                    if(y === 0 && blockId === 0) cost = 5
                    else if(blockId === 7.0) cost = 20
                    else if(this.obstacle.indexOf(blockId) != -1) cost = 2
                    else if(y != 0 && this.walkable.indexOf(blockId) != -1) cost = 1
                    else if(y != 0 && blockId === 0 && World.getBlockAt(pos).type.getID() != 0) cost = -1
                    else if(y != 0 && blockId != 0) cost = 2
                    if(modulo === -270.0 || modulo === 90.0 || modulo === 0.0) {
                        if(i > 0) left += cost;
                        else right += cost;
                    } else if(modulo === -180.0 || modulo === -90.0 || modulo === 270.0 || modulo === 180.0) {
                        if(i > 0) right += cost;
                        else left += cost;
                    }
                }
            }
        }
        return left >= right ? { key: "d", cost: right } : { key: "a", cost: left }
    }

    getNewDirection(range) {
        let left = {type: "left", cost: 0, angle: -90, blocks: this.getBlocksFromAngle(range, false, true, true, true, this.direction - 90)}
        let right = {type: "right", cost: 0, angle: 90, blocks: this.getBlocksFromAngle(range, false, true, true, true,  this.direction + 90)}
        let back = {type: "back", cost: 0, angle: 180, blocks: this.getBlocksFromAngle(range, false, true, true, true,  this.direction + 180)}
        const directions = [left, right, back]
        for(let i = 0; i < directions.length; i++) {
            for(let key in directions[i].blocks) {
                directions[i].blocks[key].forEach((block) => {
                    let blockId = block.type.getID()
                    let cost = 0
                    if(this.obstacle.indexOf(blockId) != -1) cost = 2
                    else if(blockId === 7) cost = 10
                    else if(this.walkable.indexOf(blockId) != -1) cost = -1
                    else if(blockId != 0) cost = 2
                    else cost = 3
                    directions[i].cost += cost
                })
            }
        }
        let lowestCost = Infinity
        let lowest = null
        directions.forEach((direction) => {
            if(!lowest || direction.cost < lowestCost) {
                lowest = direction
                lowestCost = direction.cost
            }
        })
        return lowest.angle
    }

    getBlocksFromAngle(range, verylow, low, medium, high, yaw=Player.getPlayer().field_70177_z, location=new Vector(Player.getX(), Player.getY(), Player.getZ())) {
        let returnObject = {}
        if(high) {
            let posHigh = []
            RaytraceUtils.rayTraceBlocks(range, [location.x, location.y + 1.5, location.z], [Math.sin(MathUtils.degreeToRad(yaw)) * -1, 0, Math.cos(MathUtils.degreeToRad(yaw))]).forEach((position) => {
                posHigh.push(World.getBlockAt(new BlockPos(position[0], position[1], position[2])))
            })
            returnObject.high = posHigh
        }
        if(medium) {
            let posMedium = []
            RaytraceUtils.rayTraceBlocks(range, [location.x, location.y + 0.5, location.z], [Math.sin(MathUtils.degreeToRad(yaw)) * -1, 0, Math.cos(MathUtils.degreeToRad(yaw))]).forEach((position) => {
                posMedium.push(World.getBlockAt(new BlockPos(position[0], position[1], position[2])))
            })
            returnObject.medium = posMedium
        }
        if(low) {
            let posLow = []
            RaytraceUtils.rayTraceBlocks(range, [location.x, location.y - 0.5, location.z], [Math.sin(MathUtils.degreeToRad(yaw)) * -1, 0, Math.cos(MathUtils.degreeToRad(yaw))]).forEach((position) => {
                posLow.push(World.getBlockAt(new BlockPos(position[0], position[1], position[2])))
            })
            returnObject.low = posLow
        }
        if(verylow) {
            let posVeryLow = []
            RaytraceUtils.rayTraceBlocks(range, [location.x, location.y - 1.5, location.z], [Math.sin(MathUtils.degreeToRad(yaw)) * -1, 0, Math.cos(MathUtils.degreeToRad(yaw))]).forEach((position) => {
                posVeryLow.push(World.getBlockAt(new BlockPos(position[0], position[1], position[2])))
            })
            returnObject.verylow = posVeryLow
        }
        return returnObject
    }

    /**
     * @param {Number} yaw
     * @returns {Map}
     */
    getBlocksAround() {
        let playerCords = new Vector(Player.getPlayer()).getBlockPos()
        let blocks = new Map()
        for(let x = -2; x <= 2; x++) {
            for(let z = -2; z <= 2; z++) {
                for(let y = 0; y <= 1; y++) {
                    let pos = playerCords.add(x, y, z)
                    let vector = Utils.convertToVector(pos).add(0.5, 0.0, 0.5);
                    if(MathUtils.getDistanceToPlayer(vector).distanceFlat <= 1.25 || Math.abs(MathUtils.calculateAngles(vector).yaw) < 90.0) {
                        blocks.set(pos, World.getBlockAt(pos).type.getID())
                    }
                }
            }
        }
        return blocks
    }

    sendMacroMessage(message) {
        ChatUtils.sendModMessage(this.ModuleName + ": " + message)
    }

    stopMacroWarning(message=undefined) {
        Utils.warnPlayer()
        this.stopMacro(message, true)
    }

    stopMacro(message=undefined, sendDisableMessage=false) {
        this.Enabled = false
        global.export.FailsafeManager.unregister()
        Rotations.stopRotate()
        PowderRotations.stop();
        MovementHelper.setKey("shift", false)
        MovementHelper.setKey("leftclick", false)
        MovementHelper.stopMovement()
        MouseUtils.reGrabMouse()
        RaytraceUtils.setSides([
            [0.01, 0.5, 0.5],
            [0.99, 0.5, 0.5],
            [0.5, 0.5, 0.01],
            [0.5, 0.5, 0.99],
            [0.5, 0.01, 0.5],
            [0.5, 0.99, 0.5]
        ])
        if(message != undefined) this.sendMacroMessage(message)
        if(sendDisableMessage) this.sendMacroMessage("&cDisabled")
    }
}

class RotationData {
    constructor(yaw, pitch, yawRadius, pitchRadius, time) {
        this.yaw = yaw
        this.pitch = pitch
        this.yawRadius = yawRadius
        this.pitchRadius = pitchRadius
        this.time = time
    }
}

new PowderMacro()