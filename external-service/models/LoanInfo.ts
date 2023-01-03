export default interface LoanInfo {
    loanAmount: number;
    loanDuration: number;
    interestRate: number;
    description: string[];
    bank: {
        name: string;
        address: string;
        phone: string;
        email: string;
    };
}