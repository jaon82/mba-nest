import { Either, left, right } from "@/core/either";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found-error";
import { IQuestionsRepository } from "../repositories/questions-repository";

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question;
  }
>;

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: IQuestionsRepository) {}
  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug);
    if (!question) {
      return left(new ResourceNotFoundError());
    }
    return right({
      question,
    });
  }
}
