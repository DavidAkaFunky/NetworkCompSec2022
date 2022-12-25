export default interface LoanInfo {
    loanAmount: number;
    loanDuration: number;
    interestRate: number;
    bank: {
        name: string;
        address: string;
        phone: string;
        email: string;
    };
}