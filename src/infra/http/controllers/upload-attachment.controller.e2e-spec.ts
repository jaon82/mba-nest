import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Upload attachment (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory],
    }).compile();
    app = moduleRef.createNestApplication();
    studentFactory = moduleRef.get(StudentFactory);
    jwtService = moduleRef.get(JwtService);
    await app.init();
  });

  test.skip("[POST] /attachments", async () => {
    const user = await studentFactory.makePrismaStudent();
    const accessToken = jwtService.sign({ sub: user.id.toString() });
    const response = await request(app.getHttpServer())
      .post("/attachments")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("file", "./test/e2e/sample-image.jpeg");
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    });
  });
});
