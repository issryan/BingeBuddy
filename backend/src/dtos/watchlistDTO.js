class WatchlistDTO {
    constructor(email, showId, title, description, poster, rank) {
        this.email = email;
        this.showId = showId;
        this.title = title;
        this.description = description;
        this.poster = poster;
        this.rank = rank;
    }

    static fromDatabase(item) {
        return new WatchlistDTO(
            item.email,
            item.showId,
            item.title,
            item.description,
            item.poster,
            item.rank
        );
    }

    static toDatabase(dto) {
        return {
            email: dto.email,
            showId: dto.showId,
            title: dto.title,
            description: dto.description,
            poster: dto.poster,
            rank: dto.rank,
        };
    }
}

module.exports = WatchlistDTO;