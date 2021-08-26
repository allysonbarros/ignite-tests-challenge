import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { Statement, OperationType } from "../../entities/Statement";
import { GetStatementOperationError } from "./GetStatementOperationError";

let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show Statement", () => {
    beforeEach(async () => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);

        const user = await createUserUseCase.execute({ name: 'Allyson Barros', email: 'a@a.com', password: '123456' });

        await createStatementUseCase.execute({
            user_id: user!.id as string,
            type: OperationType.DEPOSIT,
            amount: 150.0,
            description: 'Payment'
        });

        await createStatementUseCase.execute({
            user_id: user!.id as string,
            type: OperationType.WITHDRAW,
            amount: 15.0,
            description: 'Water Bill'
        });
    });

    it("Should be able to show a statement by ID", async () => {
        const user = await inMemoryUsersRepository.findByEmail('a@a.com');
        const { statement } = await inMemoryStatementsRepository.getUserBalance({ user_id: user!.id as string, with_statement: true }) as { balance: number, statement: Statement[] };

        const response = await getStatementOperationUseCase.execute({ user_id: user!.id as string, statement_id: statement[0].id as string });

        expect(response).toHaveProperty('amount');
    });

    it("Should not be able to show a statement by wrong ID", async () => {
        expect(async () => {
            const user = await inMemoryUsersRepository.findByEmail('a@a.com');
            const response = await getStatementOperationUseCase.execute({ user_id: user!.id as string, statement_id: '1' });
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });

    it("Should not be able to show a statement by wrong User ID", async () => {
        expect(async () => {
            const user = await inMemoryUsersRepository.findByEmail('a@a.com');

            const response = await getStatementOperationUseCase.execute({ user_id: 'batata', statement_id: 'teste' });
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });
})