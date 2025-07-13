import { SlugGenerator } from "@shared/services";
import { Slug } from "../value-objects/slug";
import { Tag } from "../value-objects/tag";

export class PostEntity {
    public readonly id: string;
    public title: string;
    public content: string;
    public author: string;
    public slug: Slug;
    public tags: Tag[];
    public summary: string; 
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(
        id: string,
        title: string,
        content: string,
        author: string,
        tags: string[],
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.tags = tags.map(tag => Tag.create(tag));
        this.summary = this.generatePostSummary(content);
        this.slug = Slug.createFromTitle(title);
        this.author = author;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static create(
        title: string,
        content: string,
        author: string,
        tags: string[],
    ) {
        
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

    public generateSlug(title): string {
        return SlugGenerator.generate(title);
    }


  public addTag(tag: Tag): void {
    if (!this.tags.some(t => t.getValue() === tag.getValue())) {
      this.tags.push(tag);
      this.updatedAt = new Date();
    }
  }

  public removeTag(tag: Tag): void {
    this.tags = this.tags.filter(t => t.getValue() !== tag.getValue());
    this.updatedAt = new Date();
  }
}