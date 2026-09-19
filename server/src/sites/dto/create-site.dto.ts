import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class CreateSiteDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9-_/]+$/, {
    message: 'Address can only contain alphanumeric characters, hyphens, underscores, and slashes',
  })
  @MaxLength(120)
  address: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(160)
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsString()
  author: string;
}

