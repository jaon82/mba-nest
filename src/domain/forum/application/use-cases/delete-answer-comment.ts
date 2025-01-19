import { Either, left, right } from "@/core/either";
import { IAnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { NotAllowedError } from "../../../../core/errors/not-allowed-error";
import { ResourceNotFoundError } from "../../../../core/errors/resource-not-found-error";

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string;
  answerCommentId: string;
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>;

export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: IAnswerCommentsRepository) {}
  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment = await this.answerCommentsRepository.findById(
      answerCommentId
    );
    if (!answerComment) {
      return left(new ResourceNotFoundError());
    }
    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError());
    }
    await this.answerCommentsRepository.delete(answerComment);
    return right({});
  }
}
