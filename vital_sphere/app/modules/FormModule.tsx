export function hasEmptyFields(formData: FormData): boolean {
    return !formData.get('username') || !formData.get('password');
}