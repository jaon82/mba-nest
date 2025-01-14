import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { PrismaService } from "./prisma/prisma.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService
  ) {}

  @Get()
  async store() {
    return await this.prismaService.user.findMany();
  }
}
