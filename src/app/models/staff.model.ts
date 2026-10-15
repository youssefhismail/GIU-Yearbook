export type Department =
    | 'Engineering'
    | 'Informatics'
    | 'Business'
    | 'Design'
    | 'Student services';
export interface StaffMember {
    id: number;
    name: string;
    department: Department;
    /** Job title, for example "Associate professor". */
    role: string;
    /** One or two sentences shown under the role. */
    bio: string;
    quote: string;
    /** Path to the portrait, relative to the /public folder. */
    photo: string;
    /** Featured members come first when "Featured first" is selected. */
    featured: boolean;
}