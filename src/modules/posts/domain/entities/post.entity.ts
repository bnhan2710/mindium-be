import { SlugGenerator } from "@shared/services";

export class PostEntity {
    public readonly id: string;
    public title: string;
    public content: string;
    public author: string;
    public slug: string
    public tags: string[];
    public summary: string; 
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(
        id: string,
        title: string,
        tags: string[],
        summary: string,
        author: string,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        this.id = id;
        this.title = title;
        this.tags = tags || []; 
        this.summary = summary;
        this.author = author;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


   public generatePostSummary(markdownContent, maxLength = 150) {
    // Remove code blocks and HTML tags from the markdown content
    const codeRegex = /<code[^>]*>.*?<\/code>/gs;
    const withoutCode = markdownContent.replace(codeRegex, '');

    // Remove HTML tags
    const htmlRegex = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
    let summary = withoutCode.replace(htmlRegex, '');

    // Remove markdown syntax
    summary = summary.replace(/\s+/g, ' ').trim();

    // Truncate the summary to the specified length
    if (summary.length > maxLength) {
        summary = summary.substring(0, maxLength) + '...';
    }

    return summary;
}

    public generateSlug(): string {

        this.slug = SlugGenerator.generate(this.title);
        return this.slug;
    }


    public addTag(tag: string): void {
        if (!this.tags.includes(tag)) {
            this.tags.push(tag);
            this.updatedAt = new Date();
        }
    }

    public removeTag(tag: string): void {
        const index = this.tags.indexOf(tag);
        if (index > -1) {
            this.tags.splice(index, 1);
            this.updatedAt = new Date();
        }
    }
}