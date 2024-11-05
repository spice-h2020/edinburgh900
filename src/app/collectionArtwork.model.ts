export class CollectionArtwork {
    constructor (
        public _id?: string,
        public type: string = "collectionartwork",
        public name?: string,
        public artist?: string,
        public year?: string,
        public filelocation?: string,
        public searchstring: string = "",
        public description: string = ""
    ) {}
}

