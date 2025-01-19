import { Either, left, right } from "@/core/either";
import { IQuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { NotAllowedError } from "../../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found-error";

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>;

export class DeleteQuestionCommentUseCase {
  constructor(
    private questionCommentsRepository: IQuestionCommentsRepository
  ) {}
  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.questionCommentsRepository.findById(
      questionCommentId
    );
    if (!questionComment) {
      return left(new ResourceNotFoundError());
    }
    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }
    await this.questionCommentsRepository.delete(questionComment);
    return right({});
  }
}