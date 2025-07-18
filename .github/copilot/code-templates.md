# Code Templates for GitHub Copilot

## 🎯 Domain Layer Templates

### Entity Template
```typescript
// src/modules/{domain}/domain/entities/{entity}.entity.ts
import { {Entity}Id } from '../value-objects/{entity}-id.vo';
import { Invalid{Entity}DataError } from '../exceptions';

export interface {Entity}Props {
    id: {Entity}Id;
    // Add other properties
    createdAt?: Date;
    updatedAt?: Date;
}

export class {Entity} {
    private readonly props: {Entity}Props;

    constructor(props: {Entity}Props) {
        this.validateProps(props);
        this.props = props;
    }

    public static create(props: Omit<{Entity}Props, 'id' | 'createdAt' | 'updatedAt'>, id?: {Entity}Id): {Entity} {
        const now = new Date();
        return new {Entity}({
            id: id || {Entity}Id.create(v4()),
            ...props,
            createdAt: now,
            updatedAt: now,
        });
    }

    private validateProps(props: {Entity}Props): void {
        if (!props.id) {
            throw new Invalid{Entity}DataError('ID is required');
        }
        // Add other validations
    }

    public getId(): {Entity}Id {
        return this.props.id;
    }

    public getCreatedAt(): Date | undefined {
        return this.props.createdAt;
    }

    public getUpdatedAt(): Date | undefined {
        return this.props.updatedAt;
    }

    // Add business methods
    public updateSomething(value: string): void {
        if (!value?.trim()) {
            throw new Invalid{Entity}DataError('Value cannot be empty');
        }
        // Update logic
        this.props.updatedAt = new Date();
    }
}
```

### Value Object Template
```typescript
// src/modules/{domain}/domain/value-objects/{value-object}.vo.ts
export class {ValueObject} {
    private readonly value: string;

    private constructor(value: string) {
        this.validate(value);
        this.value = value;
    }

    public static create(value: string): {ValueObject} {
        return new {ValueObject}(value);
    }

    private validate(value: string): void {
        if (!value?.trim()) {
            throw new Error('{ValueObject} cannot be empty');
        }
        // Add specific validation
    }

    public getValue(): string {
        return this.value;
    }

    public equals(other: {ValueObject}): boolean {
        return this.value === other.value;
    }
}
```

### Repository Interface Template
```typescript
// src/modules/{domain}/domain/ports/repositories/{entity}.repository.ts
import { {Entity} } from '../../entities/{entity}.entity';

export interface I{Entity}Repository {
    findById(id: string): Promise<{Entity} | null>;
    findByEmail(email: string): Promise<{Entity} | null>;
    save(entity: {Entity}): Promise<void>;
    delete(id: string): Promise<void>;
}
```

### Domain Exception Template
```typescript
// src/modules/{domain}/domain/exceptions/{exception}.error.ts
import { DomainError } from '@shared/common/errors/domain.error';

export class {Exception}Error extends DomainError {
    constructor(message: string) {
        super(`{Exception}: ${message}`, 400);
        this.name = '{Exception}Error';
    }
}
```

## 🎯 Application Layer Templates

### Command Template
```typescript
// src/modules/{domain}/application/commands/implements/{command}.command.ts
import { ICommand } from '@nestjs/cqrs';

export class {Command}Command implements ICommand {
    constructor(
        public readonly param1: string,
        public readonly param2: string,
    ) {}
}
```

### Command Handler Template
```typescript
// src/modules/{domain}/application/commands/handlers/{command}.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { {Command}Command } from '../implements/{command}.command';
import { I{Entity}Repository } from '@modules/{domain}/domain/ports/repositories/{entity}.repository';
import { {Entity} } from '@modules/{domain}/domain/entities/{entity}.entity';
import { Inject } from '@nestjs/common';
import { {DOMAIN}_DI_TOKENS } from '@modules/{domain}/{domain}.di-tokens';

@CommandHandler({Command}Command)
export class {Command}Handler implements ICommandHandler<{Command}Command> {
    constructor(
        @Inject({DOMAIN}_DI_TOKENS.{ENTITY}_REPOSITORY)
        private readonly {entity}Repository: I{Entity}Repository,
    ) {}

    async execute(command: {Command}Command): Promise<void> {
        const { param1, param2 } = command;

        // Business logic
        const {entity} = {Entity}.create({
            param1,
            param2,
        });

        await this.{entity}Repository.save({entity});
    }
}
```

### Query Template
```typescript
// src/modules/{domain}/application/queries/implements/{query}.query.ts
import { IQuery } from '@nestjs/cqrs';

export class {Query}Query implements IQuery {
    constructor(
        public readonly param: string,
    ) {}
}
```

### Query Handler Template
```typescript
// src/modules/{domain}/application/queries/handlers/{query}.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { {Query}Query } from '../implements/{query}.query';
import { I{Entity}Repository } from '@modules/{domain}/domain/ports/repositories/{entity}.repository';
import { Inject } from '@nestjs/common';
import { {DOMAIN}_DI_TOKENS } from '@modules/{domain}/{domain}.di-tokens';
import { {Response}Dto } from '../../dtos/{response}.dto';
import { {Entity}NotFoundError } from '@modules/{domain}/domain/exceptions';

@QueryHandler({Query}Query)
export class {Query}Handler implements IQueryHandler<{Query}Query> {
    constructor(
        @Inject({DOMAIN}_DI_TOKENS.{ENTITY}_REPOSITORY)
        private readonly {entity}Repository: I{Entity}Repository,
    ) {}

    async execute(query: {Query}Query): Promise<{Response}Dto> {
        const { param } = query;
        
        const {entity} = await this.{entity}Repository.findById(param);
        if (!{entity}) {
            throw new {Entity}NotFoundError(param);
        }

        return {Response}Dto.fromDomain({entity});
    }
}
```

### DTO Template
```typescript
// src/modules/{domain}/application/dtos/{dto}.dto.ts
import { {Entity} } from '@modules/{domain}/domain/entities/{entity}.entity';
import { ApiProperty } from '@nestjs/swagger';

export class {Dto}Dto {
    @ApiProperty({
        description: 'Entity ID',
        example: '507f1f77bcf86cd799439011'
    })
    public readonly id: string;

    @ApiProperty({
        description: 'Entity name',
        example: 'Example Name'
    })
    public readonly name: string;

    private constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    static fromDomain({entity}: {Entity}): {Dto}Dto {
        return new {Dto}Dto(
            {entity}.getId().getValue(),
            {entity}.getName()
        );
    }

    static fromDomainList({entities}: {Entity}[]): {Dto}Dto[] {
        return {entities}.map(({entity}) => {Dto}Dto.fromDomain({entity}));
    }
}
```

## 🎯 Infrastructure Layer Templates

### Repository Implementation Template
```typescript
// src/modules/{domain}/infrastructure/adapters/persistence/mongodb/mongo-{entity}.repository.ts
import { Injectable } from '@nestjs/common';
import { I{Entity}Repository } from '@modules/{domain}/domain/ports/repositories/{entity}.repository';
import { {Entity} } from '@modules/{domain}/domain/entities/{entity}.entity';
import { Model } from 'mongoose';
import { {Entity}Mapper } from '@modules/{domain}/infrastructure/mappers/{entity}.mapper';
import { {Entity}Document, {Entity}Model } from '../schema/{entity}.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class Mongo{Entity}Repository implements I{Entity}Repository {
    constructor(
        @InjectModel({Entity}Model.name)
        private readonly {entity}Model: Model<{Entity}Document>,
    ) {}

    async findById(id: string): Promise<{Entity} | null> {
        const doc = await this.{entity}Model.findById(id).exec();
        return doc ? {Entity}Mapper.toDomain(doc) : null;
    }

    async findByEmail(email: string): Promise<{Entity} | null> {
        const doc = await this.{entity}Model.findOne({ email }).exec();
        return doc ? {Entity}Mapper.toDomain(doc) : null;
    }

    async save({entity}: {Entity}): Promise<void> {
        const doc = {Entity}Mapper.toPersistence({entity});
        await this.{entity}Model.create(doc);
    }

    async delete(id: string): Promise<void> {
        await this.{entity}Model.findByIdAndDelete(id).exec();
    }
}
```

### Mapper Template
```typescript
// src/modules/{domain}/infrastructure/mappers/{entity}.mapper.ts
import { {Entity} } from '@modules/{domain}/domain/entities/{entity}.entity';
import { {Entity}Id } from '@modules/{domain}/domain/value-objects/{entity}-id.vo';
import { {Entity}Document } from '../adapters/persistence/schema/{entity}.schema';
import { Types } from 'mongoose';

export class {Entity}Mapper {
    static toDomain(doc: {Entity}Document): {Entity} {
        const {entity}Id = {Entity}Id.create(doc._id.toString());
        return new {Entity}({
            id: {entity}Id,
            name: doc.name,
            email: doc.email,
            // Map other properties
        });
    }

    static toPersistence({entity}: {Entity}): Partial<{Entity}Document> {
        return {
            _id: new Types.ObjectId({entity}.getId().getValue()),
            name: {entity}.getName(),
            email: {entity}.getEmail(),
            // Map other properties
        };
    }

    static toPersistenceCreate({entity}: {Entity}): Partial<{Entity}Document> {
        return {
            name: {entity}.getName(),
            email: {entity}.getEmail(),
            // Map other properties (without _id)
        };
    }
}
```

## 🎯 Presentation Layer Templates

### Controller Template
```typescript
// src/modules/{domain}/presentation/controllers/{entity}.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ObjectIdValidationPipe } from '@shared/common/pipes/object-id-validation.pipe';
import { {Response}Dto } from '../../application/dtos/{response}.dto';
import { Get{Entity}Query } from '../../application/queries/implements/get-{entity}.query';
import { Create{Entity}Command } from '../../application/commands/implements/create-{entity}.command';
import { Create{Entity}RequestDto } from '../../application/dtos/requests/create-{entity}.request.dto';

@ApiTags('{Entities}')
@Controller({
    path: '{entities}',
    version: '1',
})
export class {Entity}Controller {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}

    @Get(':{entity}Id')
    @ApiOperation({ summary: 'Get {entity} by ID' })
    @ApiParam({
        name: '{entity}Id',
        description: '{Entity} ID (MongoDB ObjectId)',
        example: '507f1f77bcf86cd799439011'
    })
    @ApiResponse({
        status: 200,
        description: '{Entity} retrieved successfully',
        type: {Response}Dto,
    })
    @ApiResponse({ status: 404, description: '{Entity} not found' })
    async get{Entity}(
        @Param('{entity}Id', ObjectIdValidationPipe) {entity}Id: string
    ): Promise<{Response}Dto> {
        return await this.queryBus.execute(new Get{Entity}Query({entity}Id));
    }

    @Post()
    @ApiOperation({ summary: 'Create new {entity}' })
    @ApiResponse({ status: 201, description: '{Entity} created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid input data' })
    async create{Entity}(
        @Body() create{Entity}Dto: Create{Entity}RequestDto
    ): Promise<void> {
        await this.commandBus.execute(
            new Create{Entity}Command(
                create{Entity}Dto.name,
                create{Entity}Dto.email
            )
        );
    }
}
```

## 🎯 Module Configuration Templates

### DI Tokens Template
```typescript
// src/modules/{domain}/{domain}.di-tokens.ts
export const {DOMAIN}_DI_TOKENS = {
    {ENTITY}_REPOSITORY: '{ENTITY}_REPOSITORY',
    {ENTITY}_SERVICE: '{ENTITY}_SERVICE',
} as const;
```

### Module Template
```typescript
// src/modules/{domain}/{domain}.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { {DOMAIN}_DI_TOKENS } from './{domain}.di-tokens';
import { {Entity}Controller } from './presentation/controllers/{entity}.controller';
import { Mongo{Entity}Repository } from './infrastructure/adapters/persistence/mongodb/mongo-{entity}.repository';
import { {Entity}Model, {Entity}Schema } from './infrastructure/adapters/persistence/schema/{entity}.schema';

// Query Handlers
import { Get{Entity}Handler } from './application/queries/handlers/get-{entity}.handler';

// Command Handlers
import { Create{Entity}Handler } from './application/commands/handlers/create-{entity}.handler';

const QueryHandlers = [
    Get{Entity}Handler,
];

const CommandHandlers = [
    Create{Entity}Handler,
];

const Repositories = [
    {
        provide: {DOMAIN}_DI_TOKENS.{ENTITY}_REPOSITORY,
        useClass: Mongo{Entity}Repository,
    },
];

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: {Entity}Model.name, schema: {Entity}Schema }
        ]),
    ],
    controllers: [{Entity}Controller],
    providers: [
        ...QueryHandlers,
        ...CommandHandlers,
        ...Repositories,
    ],
    exports: [...Repositories],
})
export class {Domain}Module {}
```

## 🎯 Request DTO Template
```typescript
// src/modules/{domain}/application/dtos/requests/create-{entity}.request.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, MaxLength } from 'class-validator';

export class Create{Entity}RequestDto {
    @ApiProperty({
        description: '{Entity} name',
        example: 'Example Name'
    })
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
    name: string;

    @ApiProperty({
        description: '{Entity} email',
        example: 'example@email.com'
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({
        description: 'Optional description',
        example: 'Optional field',
        required: false
    })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;
}
```

## 🎯 MongoDB Schema Template
```typescript
// src/modules/{domain}/infrastructure/adapters/persistence/schema/{entity}.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type {Entity}Document = {Entity}Model & Document;

@Schema({
    collection: '{entities}',
    timestamps: true,
})
export class {Entity}Model {
    @Prop({ type: Types.ObjectId, auto: true })
    _id: Types.ObjectId;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    description?: string;

    @Prop({ default: Date.now })
    createdAt: Date;

    @Prop({ default: Date.now })
    updatedAt: Date;
}

export const {Entity}Schema = SchemaFactory.createForClass({Entity}Model);

// Add indexes
{Entity}Schema.index({ email: 1 });
{Entity}Schema.index({ createdAt: -1 });
```

## 🎯 Usage Instructions

When generating code:

1. **Replace placeholders** with actual values:
   - `{Entity}` → `User`, `Post`, etc.
   - `{entity}` → `user`, `post`, etc.
   - `{entities}` → `users`, `posts`, etc.
   - `{domain}` → `users`, `posts`, etc.
   - `{DOMAIN}` → `USERS`, `POSTS`, etc.

2. **Follow the layer structure** - Always place files in correct directories

3. **Import correctly** - Use the established import patterns

4. **Add proper validation** - Domain validation in entities, input validation in DTOs

5. **Include error handling** - Always handle domain exceptions

6. **Add documentation** - Swagger for APIs, JSDoc for complex logic 